// Kafka Configuration
const { Kafka, logLevel } = require("kafkajs");

let kafka = null;
let producer = null;
let consumer = null;
let initAttempted = false;

const initKafka = () => {
  // Skip Kafka if disabled or already attempted
  if (process.env.KAFKA_ENABLED === "false") {
    console.log("⊘ Kafka disabled (KAFKA_ENABLED=false)");
    return null;
  }

  // Skip if not explicitly enabled (default is disabled)
  if (process.env.KAFKA_ENABLED !== "true") {
    console.log("⊘ Kafka not enabled (set KAFKA_ENABLED=true to enable)");
    return null;
  }

  if (initAttempted) {
    return kafka;
  }

  initAttempted = true;

  try {
    kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || "ielts-lms",
      brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
      connectionTimeout: 5000,
      requestTimeout: 5000,
      retry: {
        retries: 0, // Disable retries to prevent spam
      },
      logLevel: logLevel.WARN, // Reduce log verbosity
    });

    console.log("✓ Kafka client created");
    return kafka;
  } catch (error) {
    console.warn("⚠ Kafka initialization failed:", error.message);
    kafka = null;
    
    if (process.env.REQUIRE_KAFKA === "true") {
      throw error;
    }
    
    console.log("→ Running without Kafka (event publishing disabled)");
    return null;
  }
};

const getKafkaProducer = async () => {
  if (!kafka) return null;
  
  if (!producer) {
    try {
      producer = kafka.producer();
      
      // Set connection timeout
      const connectPromise = producer.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), 5000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log("✓ Kafka producer connected");
    } catch (error) {
      console.warn("⚠ Kafka producer unavailable:", error.message);
      producer = null;
      return null;
    }
  }
  
  return producer;
};

const getKafkaConsumer = async (groupId) => {
  if (!kafka) return null;
  
  if (!consumer) {
    try {
      consumer = kafka.consumer({ 
        groupId: groupId || process.env.KAFKA_CONSUMER_GROUP || "ielts-lms-group" 
      });
      
      // Set connection timeout
      const connectPromise = consumer.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), 5000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log("✓ Kafka consumer connected");
    } catch (error) {
      console.warn("⚠ Kafka consumer unavailable:", error.message);
      consumer = null;
      return null;
    }
  }
  
  return consumer;
};

const disconnectKafka = async () => {
  if (producer) {
    await producer.disconnect();
    console.log("✓ Kafka producer disconnected");
  }
  
  if (consumer) {
    await consumer.disconnect();
    console.log("✓ Kafka consumer disconnected");
  }
};

module.exports = {
  initKafka,
  getKafkaProducer,
  getKafkaConsumer,
  disconnectKafka,
};
