// Event Consumer - Subscribe to Kafka topics
const { getKafkaConsumer } = require("../config/kafka");

class EventConsumer {
  constructor() {
    this.enabled = process.env.KAFKA_ENABLED !== "false";
    this.handlers = new Map();
    this.consumer = null;
    this.subscribedTopics = new Set();
    this.topicsToSubscribe = [];
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
   * Queue a topic for subscription (use this for multiple topics)
   * @param {string} topic 
   */
  queueSubscribe(topic) {
    if (!this.enabled) return;
    if (!this.topicsToSubscribe.includes(topic)) {
      this.topicsToSubscribe.push(topic);
    }
  }

  /**
   * Start consuming events from all queued topics
   * @param {string} groupId 
   */
  async start(groupId = null) {
    if (!this.enabled) return;
    if (this.topicsToSubscribe.length === 0) return;

    try {
      if (!this.consumer) {
        this.consumer = await getKafkaConsumer(groupId);
      }

      if (!this.consumer) return;

      // Subscribe to all topics at once
      await this.consumer.subscribe({
        topics: this.topicsToSubscribe,
        fromBeginning: false,
      });

      this.topicsToSubscribe.forEach((t) => this.subscribedTopics.add(t));

      // Start consuming
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            
            const handler = this.handlers.get(event.type);
            if (handler) {
              await handler(event.data);
            }
          } catch (error) {
            console.error(`[${topic}] Error processing message:`, error.message);
          }
        },
      });

      console.log(`✓ Consumer subscribed to: ${Array.from(this.subscribedTopics).join(", ")}`);
    } catch (error) {
      console.error("✗ Failed to start consumer:", error.message);
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
