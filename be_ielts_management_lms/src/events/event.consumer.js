// Event Consumer - Subscribe to Kafka topics
const { getKafkaConsumer } = require("../config/kafka");

class EventConsumer {
  constructor() {
    this.enabled = process.env.KAFKA_ENABLED !== "false";
    this.handlers = new Map();
  }

  /**
   * Register event handler
   * @param {string} eventType 
   * @param {Function} handler 
   */
  on(eventType, handler) {
    this.handlers.set(eventType, handler);
  }

  /**
   * Start consuming events from topic
   * @param {string} topic 
   * @param {string} groupId 
   */
  async subscribe(topic, groupId = null) {
    if (!this.enabled) {
      console.log(`Consumer not started (Kafka disabled): ${topic}`);
      return;
    }

    try {
      const consumer = await getKafkaConsumer(groupId);
      if (!consumer) return;

      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            console.log(`Received event from ${topic}:`, event.type);

            const handler = this.handlers.get(event.type);
            if (handler) {
              await handler(event.data);
            } else {
              console.warn(`No handler for event type: ${event.type}`);
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        },
      });

      console.log(`✓ Consumer subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to subscribe to ${topic}:`, error);
    }
  }

  /**
   * Setup user event handlers
   */
  setupUserEventHandlers() {
    this.on("USER_REGISTERED", async (data) => {
      console.log("Processing USER_REGISTERED:", data.email);
      // Send welcome email
      // Update analytics
    });

    this.on("USER_LOGGED_IN", async (data) => {
      console.log("Processing USER_LOGGED_IN:", data.email);
      // Update last login analytics
    });
  }

  /**
   * Setup notification event handlers
   */
  setupNotificationEventHandlers() {
    this.on("EMAIL_NOTIFICATION", async (data) => {
      console.log("Processing EMAIL_NOTIFICATION:", data.to);
      // Send email via email service
    });
  }
}

module.exports = new EventConsumer();
