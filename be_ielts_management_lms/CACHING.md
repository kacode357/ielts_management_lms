# Caching Strategy with Redis

## Overview
The application uses Redis for caching frequently accessed data, reducing database load and improving API response times.

## Configuration

### Environment Variables
```env
# Enable/disable Redis caching
REDIS_ENABLED=true

# Redis connection URL
REDIS_URL=redis://localhost:6379

# Redis connection timeout (ms)
REDIS_TIMEOUT=5000

# Fail on startup if Redis is unavailable (default: false)
REQUIRE_REDIS=false
```

### Graceful Degradation
If `REQUIRE_REDIS=false` (default), the application will:
- Log a warning if Redis connection fails
- Continue running without caching
- All cache operations will be no-ops (return null/undefined)

## Cache Service API

### Basic Operations

```javascript
const cacheService = require("../cache/cache.service");

// Get value from cache
const value = await cacheService.get("user:123");

// Set value in cache with TTL (seconds)
await cacheService.set("user:123", JSON.stringify(userData), 300);

// Delete single key
await cacheService.del("user:123");

// Delete by pattern (e.g., all user keys)
await cacheService.delPattern("user:*");
```

### Cache-Aside Pattern (wrap)

```javascript
// Automatically cache database query results
const user = await cacheService.wrap(
  "user:123",           // Cache key
  300,                  // TTL in seconds
  async () => {         // Function to execute on cache miss
    return await User.findById("123");
  }
);

// First call: Cache MISS → Query DB → Store in cache → Return result
// Subsequent calls: Cache HIT → Return from cache (faster)
```

## Cache Middleware

### Automatic Caching for GET Requests

```javascript
const { cacheMiddleware } = require("../middleware/cache");

// Cache for 5 minutes (300 seconds)
router.get("/users", cacheMiddleware(300), userController.getUsers);

// Cache for 1 hour with custom key generator
router.get(
  "/courses/:id",
  cacheMiddleware(3600, (req) => `course:${req.params.id}`),
  courseController.getCourse
);
```

### Cache Invalidation

```javascript
const { invalidateCache } = require("../middleware/cache");

// Invalidate all user-related caches after update
router.put("/users/:id", async (req, res) => {
  await userService.updateUser(req.params.id, req.body);
  
  // Invalidate cache
  await invalidateCache("user:*");
  await invalidateCache("api:/users*");
  
  res.json({ success: true });
});
```

## Caching Strategies

### 1. Cache-Aside (Lazy Loading)
Most common pattern - check cache first, load from DB on miss.

```javascript
async function getUser(userId) {
  // Try cache first
  const cached = await cacheService.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - load from DB
  const user = await User.findById(userId);
  
  // Store in cache for 5 minutes
  await cacheService.set(`user:${userId}`, JSON.stringify(user), 300);
  
  return user;
}
```

### 2. Write-Through
Update cache whenever data is updated in DB.

```javascript
async function updateUser(userId, updates) {
  // Update database
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  
  // Update cache
  await cacheService.set(`user:${userId}`, JSON.stringify(user), 300);
  
  return user;
}
```

### 3. Write-Behind (Write-Back)
Update cache immediately, sync to DB asynchronously.

```javascript
async function incrementViewCount(courseId) {
  // Increment in cache immediately
  await cacheService.incr(`course:${courseId}:views`);
  
  // Publish event for async DB update
  await eventProducer.publish("analytics.events", {
    event: "course_viewed",
    courseId,
  });
}
```

## Cache Key Naming Conventions

### Pattern: `entity:identifier:field`

```javascript
// User cache keys
"user:123"                  // Full user object
"user:123:profile"          // User profile only
"user:email:john@test.com"  // User by email lookup

// Course cache keys
"course:456"                // Full course object
"course:456:students"       // Course students list
"course:456:materials"      // Course materials

// API response cache keys
"api:/users?page=1&limit=10"           // List endpoint
"api:/courses/123:user:456"            // Per-user cached response
```

## TTL Guidelines

### Time-to-Live Recommendations

```javascript
// Frequently changing data (short TTL)
const TTL_SHORT = 60;        // 1 minute
const TTL_MEDIUM = 300;      // 5 minutes
const TTL_LONG = 3600;       // 1 hour
const TTL_VERY_LONG = 86400; // 24 hours

// Examples
cacheService.set("realtime:stats", data, TTL_SHORT);      // Real-time stats
cacheService.set("user:profile", data, TTL_MEDIUM);       // User profiles
cacheService.set("course:list", data, TTL_LONG);          // Course catalog
cacheService.set("config:app", data, TTL_VERY_LONG);      // App config
```

### Dynamic TTL

```javascript
// Cache longer for stable data
const ttl = user.isVerified ? 3600 : 300;
await cacheService.set(`user:${userId}`, data, ttl);
```

## Common Caching Patterns

### 1. List Pagination
```javascript
router.get("/courses", cacheMiddleware(300), async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  
  // Cache key includes pagination params
  const cacheKey = `api:/courses?page=${page}&limit=${limit}`;
  
  const courses = await cacheService.wrap(cacheKey, 300, async () => {
    return await Course.find()
      .skip((page - 1) * limit)
      .limit(limit);
  });
  
  res.json(courses);
});
```

### 2. User-Specific Cache
```javascript
router.get("/dashboard", authenticate, cacheMiddleware(60), async (req, res) => {
  // Cache is per-user (middleware includes user.id in key)
  const data = await dashboardService.getData(req.user.id);
  res.json(data);
});
```

### 3. Conditional Caching
```javascript
router.get("/courses/:id", async (req, res) => {
  const useCache = req.query.cache !== "false";
  
  let course;
  if (useCache) {
    course = await cacheService.wrap(`course:${req.params.id}`, 3600, async () => {
      return await Course.findById(req.params.id);
    });
  } else {
    course = await Course.findById(req.params.id);
  }
  
  res.json(course);
});
```

## Cache Invalidation Strategies

### 1. Time-Based (TTL)
Simplest - cache expires after TTL.

```javascript
await cacheService.set("data", value, 300); // Auto-expires after 5 min
```

### 2. Event-Based
Invalidate when data changes.

```javascript
// After update
await User.findByIdAndUpdate(userId, updates);
await invalidateCache(`user:${userId}*`);
```

### 3. Manual Invalidation Endpoint
Admin endpoint to clear cache.

```javascript
router.post("/admin/cache/clear", authorizeRoles("admin"), async (req, res) => {
  const pattern = req.body.pattern || "*";
  await invalidateCache(pattern);
  res.json({ message: "Cache cleared", pattern });
});
```

### 4. Version-Based
Include version in cache key.

```javascript
const cacheKey = `user:${userId}:v${user.version}`;
await cacheService.set(cacheKey, data, 3600);
```

## Performance Monitoring

### Cache Hit Rate
```javascript
let hits = 0;
let misses = 0;

// Track in cache service
async function get(key) {
  const value = await redis.get(key);
  if (value) hits++;
  else misses++;
  return value;
}

// Expose metrics endpoint
router.get("/metrics/cache", (req, res) => {
  const total = hits + misses;
  const hitRate = total > 0 ? (hits / total * 100).toFixed(2) : 0;
  
  res.json({
    hits,
    misses,
    total,
    hitRate: `${hitRate}%`,
  });
});
```

### Cache Size
```javascript
router.get("/admin/cache/stats", async (req, res) => {
  const redis = getRedisClient();
  const dbSize = await redis.dbSize();
  const info = await redis.info("memory");
  
  res.json({
    keys: dbSize,
    memory: info,
  });
});
```

## Best Practices

### 1. Always Set TTL
Never cache without expiration.

```javascript
// ❌ Bad - no TTL (key lives forever)
await cacheService.set("user:123", data);

// ✅ Good - with TTL
await cacheService.set("user:123", data, 300);
```

### 2. Handle Cache Failures Gracefully
```javascript
try {
  const cached = await cacheService.get(key);
  if (cached) return JSON.parse(cached);
} catch (err) {
  console.error("[Cache] Get error:", err.message);
  // Continue without cache
}

// Fallback to DB
return await User.findById(id);
```

### 3. Invalidate Related Keys
```javascript
// After updating user
await invalidateCache(`user:${userId}*`);        // User data
await invalidateCache(`api:/users*`);            // User lists
await invalidateCache(`dashboard:${userId}*`);   // User dashboard
```

### 4. Use Compression for Large Objects
```javascript
const zlib = require("zlib");

// Compress before caching
const compressed = zlib.gzipSync(JSON.stringify(largeData));
await cacheService.set(key, compressed.toString("base64"), 3600);

// Decompress when reading
const cached = await cacheService.get(key);
const decompressed = zlib.gunzipSync(Buffer.from(cached, "base64"));
const data = JSON.parse(decompressed.toString());
```

### 5. Avoid Cache Stampede
```javascript
// Use distributed lock or early expiration
const lockKey = `lock:${cacheKey}`;
const hasLock = await cacheService.set(lockKey, "1", 10, "NX");

if (hasLock) {
  // Only one process refreshes cache
  const data = await expensiveQuery();
  await cacheService.set(cacheKey, data, 300);
} else {
  // Others wait briefly then retry
  await sleep(100);
  return await cacheService.get(cacheKey);
}
```

## Troubleshooting

### Cache not working
1. Check `REDIS_ENABLED=true` in `.env`
2. Verify Redis is running: `redis-cli ping` → `PONG`
3. Check Redis URL is correct
4. Review logs for connection errors

### Memory issues
1. Monitor Redis memory usage
2. Set appropriate TTLs
3. Use `maxmemory` policy in Redis config
4. Consider cache eviction strategies (LRU, LFU)

### Stale data
1. Reduce TTL for frequently changing data
2. Implement proper cache invalidation
3. Use versioning in cache keys
4. Add "refresh" query parameter for force reload

## Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Node.js Client](https://github.com/redis/node-redis)
- [Caching Strategies](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)
