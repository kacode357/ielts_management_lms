// Event Consumer - Subscribe to Kafka topics
const { getKafkaConsumer } = require("../config/kafka");

class EventConsumer {
  constructor() {
    this.enabled = process.env.KAFKA_ENABLED !== "false";
    this.handlers = new Map();
    this.consumer = null;
    this.subscribedTopics = new Set();
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
      return;
    }

    // Avoid duplicate subscriptions
    if (this.subscribedTopics.has(topic)) {
      return;
    }

    try {
      if (!this.consumer) {
        this.consumer = await getKafkaConsumer(groupId);
      }

      if (!this.consumer) return;

      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.subscribedTopics.add(topic);

      // Only run consumer once
      if (this.subscribedTopics.size === 1) {
        await this.consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            try {
              const event = JSON.parse(message.value.toString());
              
              const handler = this.handlers.get(event.type);
              if (handler) {
                await handler(event.data);
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          },
        });
      }

      console.log(`✓ Consumer subscribed to: ${topic}`);
    } catch (error) {
      console.error(`✗ Failed to subscribe to ${topic}:`, error.message);
    }
  }

  /**
   * Setup user event handlers
   */
  setupUserEventHandlers() {
    this.on("USER_REGISTERED", async (data) => {
      // Send welcome email or update analytics
    });

    this.on("USER_LOGGED_IN", async (data) => {
      // Update last login analytics
    });
  }

  /**
   * Setup notification event handlers
   */
  setupNotificationEventHandlers() {
    this.on("EMAIL_NOTIFICATION", async (data) => {
      // Send email notification
    });
  }
}

module.exports = new EventConsumer();
