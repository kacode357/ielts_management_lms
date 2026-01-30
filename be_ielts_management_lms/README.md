# IELTS Management LMS API

## 📁 Project Structure

```
src/
├── models/              # Database models (Mongoose schemas)
│   └── user.model.js
├── controllers/         # Request handlers (handle HTTP requests/responses)
│   └── auth.controller.js
├── services/           # Business logic layer
│   └── auth.service.js
├── routes/             # API route definitions
│   └── auth.routes.js
├── responses/          # Multi-language response messages
│   ├── index.js       # Response manager
│   ├── en.js          # English messages
│   └── vi.js          # Vietnamese messages
├── middleware/         # Custom middleware
│   ├── auth.js
│   ├── authorizeRoles.js
│   └── validate.js
├── utils/             # Helper utilities
│   ├── appError.js
│   ├── email.js
│   └── response.js
├── docs/              # API documentation (Swagger)
│   └── swagger.js
├── db/                # Database configuration
│   ├── init.js
│   ├── mongoose.js
│   └── adminSeeder.js
├── constants/         # Application constants
│   └── messages.js
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 🌍 Multi-language Support

API hỗ trợ đa ngôn ngữ thông qua header `Accept-Language`:

```bash
# English (default)
curl -H "Accept-Language: en" http://localhost:5000/api/auth/login

# Vietnamese
curl -H "Accept-Language: vi" http://localhost:5000/api/auth/login
```

### Thêm ngôn ngữ mới

1. Tạo file message mới: `src/responses/ja.js` (ví dụ tiếng Nhật)
2. Thêm import vào `src/responses/index.js`:
```javascript
const ja = require("./ja");
const messages = {
  en,
  vi,
  ja, // Add here
};
```

## 📖 API Documentation (Swagger)

Swagger UI tự động cập nhật khi bạn thay đổi controller:

1. Mở: http://localhost:5000/api-docs
2. Thêm JSDoc comments trong controller:

```javascript
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
exports.register = async (req, res, next) => {
  // ...
};
```

3. Lưu file → Swagger UI tự động reload!

## 🔧 Development Workflow

### 1. Tạo Model mới
```javascript
// src/models/course.model.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ...
});

module.exports = mongoose.model("Course", courseSchema);
```

### 2. Tạo Service
```javascript
// src/services/course.service.js
const Course = require("../models/course.model");
const { getMessage } = require("../responses");

class CourseService {
  async createCourse(data, lang = "en") {
    // Business logic here
    return course;
  }
}

module.exports = new CourseService();
```

### 3. Tạo Controller với Swagger Doc
```javascript
// src/controllers/course.controller.js
const courseService = require("../services/course.service");
const { sendSuccess } = require("../utils/response");
const { getMessage } = require("../responses");

/**
 * @openapi
 * /api/courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create new course
 */
exports.createCourse = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const course = await courseService.createCourse(req.body, lang);
    sendSuccess(res, { course }, 201, getMessage("COURSE.CREATE_SUCCESS", lang));
  } catch (error) {
    next(error);
  }
};
```

### 4. Tạo Routes
```javascript
// src/routes/course.routes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth");

router.post("/", auth, courseController.createCourse);

module.exports = router;
```

### 5. Register Route trong app.js
```javascript
// src/app.js
app.use("/api/courses", require("./routes/course.routes"));
```

### 6. Thêm Response Messages
```javascript
// src/responses/en.js
module.exports = {
  COURSE: {
    CREATE_SUCCESS: "Course created successfully",
    // ...
  }
};

// src/responses/vi.js
module.exports = {
  COURSE: {
    CREATE_SUCCESS: "Tạo khóa học thành công",
    // ...
  }
};
```

## 🔐 Authentication

Tất cả protected routes yêu cầu JWT token:

```bash
# Login để lấy token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ieltslms.com","password":"Admin@123456"}'

# Sử dụng token
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

## 🌟 Features

- ✅ Clean architecture (Models, Controllers, Services, Routes)
- ✅ Multi-language support (EN, VI - easily extensible)
- ✅ Auto-reload Swagger documentation
- ✅ JWT authentication
- ✅ MongoDB with Mongoose
- ✅ Error handling middleware
- ✅ Request validation
- ✅ Role-based access control

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Health Check
- `GET /health` - API health check

## 📚 Resources

- Swagger UI: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health

## 📄 License

MIT
