// Bootstrap: load environment variables and start the HTTP server
require("dotenv").config();

const app = require("./app");
const { initDatabase } = require("./db/init");
const { connectRedis, getRedisClient, disconnectRedis } = require("./config/redis");
const { initKafka, getKafkaProducer, disconnectKafka } = require("./config/kafka");
const eventConsumer = require("./events/event.consumer");

const PORT = process.env.PORT || 3001;

/**
 * Initialize database and start the server
 */
async function start() {
  try {
    // Connect to MongoDB and initialize database
    await initDatabase();
  } catch (err) {
    const allowStartWithoutDb =
      String(process.env.ALLOW_START_WITHOUT_DB || "")
        .trim()
        .toLowerCase() === "true";
    
    if (!allowStartWithoutDb) {
      console.error("✗ Database initialization failed:", err.message);
      throw err;
    }

    console.warn(
      "⚠ DB init failed but ALLOW_START_WITHOUT_DB=true, continuing without DB:",
      err && err.message ? err.message : err
    );
  }

  // Initialize Redis (optional)
  try {
    await connectRedis();
  } catch (err) {
    console.warn("⚠ Redis initialization failed:", err.message);
  }

  // Initialize Kafka (optional)
  try {
    const kafkaClient = initKafka();
    
    // Only setup consumers if Kafka is initialized
    if (kafkaClient) {
      // Setup event consumers
      eventConsumer.setupUserEventHandlers();
      eventConsumer.setupNotificationEventHandlers();
      
      // Subscribe to topics
      await eventConsumer.subscribe("user.events");
      await eventConsumer.subscribe("notification.events");
    }
  } catch (err) {
    console.warn("⚠ Kafka initialization failed:", err.message);
  }

  // Start HTTP server
  const server = app.listen(PORT, async () => {
    console.log(`\n🚀 IELTS Management LMS API`);
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    
    // Show Swagger docs URL only in development
    if (process.env.NODE_ENV === "development" && 
        String(process.env.SWAGGER_UI_ENABLED || "true").toLowerCase() === "true") {
      console.log(`   Docs: http://localhost:${PORT}/api-docs`);
    }
    
    // Show service status
    console.log(`\n📡 Services:`);
    console.log(`   MongoDB: ✓ Connected`);
    
    // Redis status
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPort = process.env.REDIS_PORT || "6379";
    const redisStatus = getRedisClient() ? "✓" : "✗";
    console.log(`   Redis: ${redisStatus} ${redisHost}:${redisPort}`);
    
    // Kafka status - wait a bit for producer to connect
    if (process.env.KAFKA_ENABLED === "true") {
      const kafkaBrokers = process.env.KAFKA_BROKERS || "localhost:9092";
      // Give Kafka time to connect
      setTimeout(async () => {
        const producer = await getKafkaProducer();
        const kafkaStatus = producer ? "✓" : "✗";
        console.log(`   Kafka: ${kafkaStatus} ${kafkaBrokers}`);
      }, 1000);
    }
    
    console.log("");
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log("\n🛑 Shutting down gracefully...");
    
    server.close(async () => {
      await disconnectRedis();
      await disconnectKafka();
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error("⚠ Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

start();
