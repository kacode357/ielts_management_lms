# Quick Start Guide - IELTS LMS API

## 🎯 Cấu trúc Project Mới

```
src/
├── models/              # Mongoose models
├── controllers/         # Request handlers + Swagger docs
├── services/           # Business logic
├── routes/             # API routes
└── responses/          # Multi-language messages
    ├── en.js          # English
    ├── vi.js          # Vietnamese
    └── index.js       # Response manager
```

## 🔥 Swagger Auto-Reload

**Khi bạn edit controller → Swagger UI tự động update!**

### Ví dụ:
1. Mở [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
2. Edit `src/controllers/auth.controller.js` - thay đổi JSDoc comment
3. Lưu file
4. Refresh trình duyệt → Swagger đã update!

### JSDoc Format cho Swagger:

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
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 */
exports.register = async (req, res, next) => {
  // Implementation
};
```

## 🌍 Multi-language Response

### Sử dụng trong code:

```javascript
// src/controllers/auth.controller.js
const { getMessage } = require("../responses");

exports.login = async (req, res, next) => {
  const lang = req.headers["accept-language"] || "en";
  
  sendSuccess(
    res, 
    { token, user }, 
    200, 
    getMessage("AUTH.LOGIN_SUCCESS", lang)
  );
};
```

### Test với CURL:

```bash
# English
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email":"admin@ieltslms.com","password":"Admin@123456"}'

# Vietnamese
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: vi" \
  -d '{"email":"admin@ieltslms.com","password":"Admin@123456"}'
```

### Thêm message mới:

```javascript
// src/responses/en.js
module.exports = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    // Add more here
  },
  COURSE: {  // New module
    CREATE_SUCCESS: "Course created successfully",
    DELETE_SUCCESS: "Course deleted successfully",
  }
};

// src/responses/vi.js
module.exports = {
  AUTH: {
    REGISTER_SUCCESS: "Đăng ký người dùng thành công",
    LOGIN_SUCCESS: "Đăng nhập thành công",
  },
  COURSE: {  // New module
    CREATE_SUCCESS: "Tạo khóa học thành công",
    DELETE_SUCCESS: "Xóa khóa học thành công",
  }
};
```

## 📝 Quy trình tạo API mới

### 1. Tạo Model
```javascript
// src/models/course.model.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
```

### 2. Tạo Service
```javascript
// src/services/course.service.js
const Course = require("../models/course.model");
const { getMessage } = require("../responses");
const { AppError } = require("../utils/appError");

class CourseService {
  async getAllCourses(lang = "en") {
    const courses = await Course.find();
    return courses;
  }

  async createCourse(data, lang = "en") {
    const course = await Course.create(data);
    return course;
  }
}

module.exports = new CourseService();
```

### 3. Tạo Controller với Swagger
```javascript
// src/controllers/course.controller.js
const courseService = require("../services/course.service");
const { sendSuccess } = require("../utils/response");
const { getMessage } = require("../responses");

/**
 * @openapi
 * /api/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const courses = await courseService.getAllCourses(lang);
    sendSuccess(res, { courses }, 200, getMessage("COURSE.LIST_SUCCESS", lang));
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create new course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
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

router.get("/", courseController.getAllCourses);
router.post("/", auth, courseController.createCourse);

module.exports = router;
```

### 5. Register vào app.js
```javascript
// src/app.js
app.use("/api/courses", require("./routes/course.routes"));
```

### 6. Thêm messages
```javascript
// src/responses/en.js - thêm vào module.exports
COURSE: {
  LIST_SUCCESS: "Courses retrieved successfully",
  CREATE_SUCCESS: "Course created successfully",
}

// src/responses/vi.js - thêm vào module.exports
COURSE: {
  LIST_SUCCESS: "Lấy danh sách khóa học thành công",
  CREATE_SUCCESS: "Tạo khóa học thành công",
}
```

## 🧪 Test API

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ieltslms.com","password":"Admin@123456"}'

# 2. Use token for protected routes
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept-Language: vi"
```

## 🎨 Tips

1. **Always get language from header:**
   ```javascript
   const lang = req.headers["accept-language"] || "en";
   ```

2. **Use getMessage for all user-facing messages:**
   ```javascript
   getMessage("AUTH.LOGIN_SUCCESS", lang)
   ```

3. **Add Swagger docs to all controller functions**

4. **Keep business logic in services, not controllers**

5. **Models only contain schema definition**

## 🔗 Links

- API Docs: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health

## 🚀 Default Admin Account

```
Email: admin@ieltslms.com
Password: Admin@123456
```

**⚠️ Change password after first login!**
