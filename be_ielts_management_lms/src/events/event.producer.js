// Event Producer - Publish events to Kafka
const { getKafkaProducer } = require("../config/kafka");

class EventProducer {
  constructor() {
    this.enabled = process.env.KAFKA_ENABLED !== "false";
  }

  /**
   * Publish event to Kafka topic
   * @param {string} topic 
   * @param {Object} event 
   * @returns {Promise<boolean>}
   */
  async publish(topic, event) {
    if (!this.enabled) {
      console.log(`Event not published (Kafka disabled): ${topic}`);
      return false;
    }

    try {
      const producer = await getKafkaProducer();
      if (!producer) return false;

      const message = {
        key: event.id || Date.now().toString(),
        value: JSON.stringify(event),
        timestamp: Date.now().toString(),
      };

      await producer.send({
        topic,
        messages: [message],
      });

      console.log(`✓ Event published to ${topic}:`, event.type);
      return true;
    } catch (error) {
      console.error(`Failed to publish event to ${topic}:`, error);
      return false;
    }
  }

  /**
   * Publish user events
   */
  async publishUserRegistered(user) {
    return this.publish("user.events", {
      type: "USER_REGISTERED",
      data: user,
      timestamp: new Date().toISOString(),
    });
  }

  async publishUserLoggedIn(user) {
    return this.publish("user.events", {
      type: "USER_LOGGED_IN",
      data: { userId: user._id, email: user.email },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publish notification events
   */
  async publishEmailNotification(emailData) {
    return this.publish("notification.events", {
      type: "EMAIL_NOTIFICATION",
      data: emailData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publish analytics events
   */
  async publishAnalyticsEvent(eventType, data) {
    return this.publish("analytics.events", {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = new EventProducer();
