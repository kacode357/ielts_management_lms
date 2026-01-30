# Event-Driven Architecture with Kafka

## Overview
The application uses Kafka for asynchronous event processing, enabling loose coupling between services and scalable background task execution.

## Configuration

### Environment Variables
```env
# Enable/disable Kafka
KAFKA_ENABLED=true

# Kafka broker addresses (comma-separated)
KAFKA_BROKERS=localhost:9092

# Client ID for Kafka producer/consumer
KAFKA_CLIENT_ID=ielts-lms-api

# Consumer group ID
KAFKA_GROUP_ID=ielts-lms-group

# Fail on startup if Kafka is unavailable (default: false)
REQUIRE_KAFKA=false
```

### Graceful Degradation
If `REQUIRE_KAFKA=false` (default), the application will:
- Log a warning if Kafka connection fails
- Continue running without event publishing
- Skip event consumers initialization

## Event Topics

### 1. user.events
User lifecycle events

**Events:**
- `user.registered` - New user account created
- `user.logged_in` - User successful login
- `user.updated` - User profile updated
- `user.deleted` - User account deleted

### 2. notification.events
Notification delivery events

**Events:**
- `notification.email` - Send email notification
- `notification.sms` - Send SMS notification
- `notification.push` - Send push notification

### 3. analytics.events
User behavior and system analytics

**Events:**
- `analytics.tracked` - Track user action/event

## Event Schemas

### user.registered
```javascript
{
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  registeredAt: Date
}
```

### user.logged_in
```javascript
{
  userId: string,
  email: string,
  role: string,
  loginAt: Date,
  ipAddress?: string
}
```

### notification.email
```javascript
{
  to: string,
  subject: string,
  template: string,
  data: Object
}
```

### analytics.tracked
```javascript
{
  event: string,
  userId?: string,
  timestamp: Date,
  metadata: Object
}
```

## Usage Examples

### Publishing Events (Producer)

```javascript
const eventProducer = require("../events/event.producer");

// Publish user registered event
await eventProducer.publishUserRegistered({
  userId: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
});

// Publish email notification
await eventProducer.publishEmailNotification({
  to: "user@example.com",
  subject: "Welcome!",
  template: "welcome",
  data: { name: "John Doe" },
});

// Publish analytics
await eventProducer.publishAnalyticsTracked({
  event: "course_enrolled",
  userId: user._id.toString(),
  metadata: { courseId: "123", price: 99.99 },
});
```

### Consuming Events (Consumer)

```javascript
const eventConsumer = require("../events/event.consumer");

// Register event handler
eventConsumer.on("user.registered", async (event) => {
  console.log("New user registered:", event.userId);
  
  // Send welcome email
  // Update analytics dashboard
  // Create user profile in other services
});

// Subscribe to topic
await eventConsumer.subscribe("user.events");

// Setup predefined handlers
eventConsumer.setupUserEventHandlers();
eventConsumer.setupNotificationEventHandlers();
```

## Event Handlers

### User Event Handlers
Located in `event.consumer.js`, automatically registered on startup:

**user.registered**
- Log new user registration
- Can be extended to send welcome email, update CRM, etc.

**user.logged_in**
- Log user login activity
- Can be extended to detect suspicious logins, update analytics, etc.

**user.updated**
- Log profile updates
- Can be extended to sync with other services

### Notification Event Handlers

**notification.email**
- Process email sending queue
- Can integrate with SendGrid, AWS SES, etc.

**notification.sms**
- Process SMS sending queue
- Can integrate with Twilio, AWS SNS, etc.

## Best Practices

### 1. Error Handling
Always wrap event publishing in try-catch to prevent blocking main flow:

```javascript
try {
  await eventProducer.publishUserRegistered(userData);
} catch (err) {
  console.error("[Event] Failed to publish:", err.message);
  // Continue without failing the request
}
```

### 2. Idempotency
Event handlers should be idempotent (safe to process multiple times):

```javascript
eventConsumer.on("user.registered", async (event) => {
  // Check if already processed
  const existing = await WelcomeEmail.findOne({ userId: event.userId });
  if (existing) return;
  
  // Process event
  await sendWelcomeEmail(event);
});
```

### 3. Event Versioning
Include version in event schema for backward compatibility:

```javascript
{
  version: "1.0",
  userId: "123",
  email: "user@example.com"
}
```

### 4. Dead Letter Queue
Handle failed events by publishing to DLQ topic:

```javascript
try {
  await processEvent(event);
} catch (err) {
  await eventProducer.publish("dlq.topic", event);
}
```

## Monitoring

### Producer Metrics
- Events published per topic
- Publishing failures
- Average publishing latency

### Consumer Metrics
- Events consumed per topic
- Processing failures
- Consumer lag (offset behind latest)

### Health Checks
Check Kafka connection status:

```javascript
const { getKafkaProducer } = require("./config/kafka");

app.get("/health/kafka", (req, res) => {
  const producer = getKafkaProducer();
  const isConnected = producer !== null;
  
  res.json({
    kafka: {
      enabled: process.env.KAFKA_ENABLED === "true",
      connected: isConnected,
    },
  });
});
```

## Common Use Cases

### 1. Email Notifications
User registers → Publish event → Consumer sends welcome email

### 2. Analytics Tracking
User logs in → Publish event → Consumer updates analytics dashboard

### 3. Data Synchronization
User updates profile → Publish event → Consumer syncs with external services

### 4. Audit Logging
Any user action → Publish event → Consumer writes to audit log

### 5. Background Jobs
Payment received → Publish event → Consumer generates invoice PDF

## Troubleshooting

### Event not consumed
1. Check consumer is subscribed to correct topic
2. Verify consumer group ID is correct
3. Check Kafka logs for errors
4. Ensure event schema matches handler expectations

### Publishing failures
1. Check Kafka broker connection
2. Verify topic exists (auto-create enabled?)
3. Check producer configuration
4. Review event payload size (too large?)

### Slow processing
1. Increase consumer instances (scale horizontally)
2. Optimize event handler code
3. Add database indexes for queries in handlers
4. Consider batch processing for bulk operations

## Migration from Synchronous to Async

### Before (Synchronous)
```javascript
async register(userData) {
  const user = await User.create(userData);
  await sendWelcomeEmail(user); // Blocks the response
  return user;
}
```

### After (Asynchronous)
```javascript
async register(userData) {
  const user = await User.create(userData);
  
  // Async - doesn't block the response
  await eventProducer.publishUserRegistered(user);
  
  return user; // Returns immediately
}
```

## Resources

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [KafkaJS Library](https://kafka.js.org/)
- [Event-Driven Architecture Patterns](https://microservices.io/patterns/data/event-driven-architecture.html)
