// Kafka Configuration
const { Kafka, logLevel, Partitioners } = require("kafkajs");

let kafka = null;
let producer = null;
let consumer = null;
let initAttempted = false;

const initKafka = () => {
  // Skip Kafka if disabled or already attempted
  if (process.env.KAFKA_ENABLED === "false") {
    return null;
  }

  // Skip if not explicitly enabled (default is disabled)
  if (process.env.KAFKA_ENABLED !== "true") {
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
      connectionTimeout: 10000,
      requestTimeout: 60000,
      retry: {
        retries: 5,
        initialRetryTime: 500,
        maxRetryTime: 30000,
      },
      logLevel: logLevel.ERROR_ONLY, // Only show errors
    });

    console.log("✓ Kafka client created");
    return kafka;
  } catch (error) {
    console.warn("⚠ Kafka initialization failed:", error.message);
    kafka = null;
    
    if (process.env.REQUIRE_KAFKA === "true") {
      throw error;
    }
    
    return null;
  }
};

const getKafkaProducer = async () => {
  if (!kafka) return null;
  
  if (!producer) {
    try {
      producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner, // Fix partitioner warning
      });
      
      await producer.connect();
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
        groupId: groupId || process.env.KAFKA_CONSUMER_GROUP || "ielts-lms-group",
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      });
      
      await consumer.connect();
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
  try {
    if (producer) {
      await producer.disconnect();
    }
    
    if (consumer) {
      await consumer.disconnect();
    }
  } catch (error) {
    // Silent disconnect errors
  }
};

module.exports = {
  initKafka,
  getKafkaProducer,
  getKafkaConsumer,
  disconnectKafka,
};
