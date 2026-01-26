// Express app configuration: routes, middleware, swagger, error handling
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { isAppError } = require("./utils/appError");
const { sendError } = require("./utils/response");
const MESSAGES = require("./constants/messages");

const app = express();

// Toggle Swagger UI - only in development mode
const isSwaggerEnabled =
  process.env.NODE_ENV === "development" &&
  String(process.env.SWAGGER_UI_ENABLED || "true").toLowerCase() === "true";

// CORS Configuration - Allow all origins with credentials
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parser and cookie parser middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   example: 2026-01-26T10:00:00.000Z
 */
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "IELTS Management LMS API"
  });
});

// Swagger API Documentation
if (isSwaggerEnabled) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "IELTS LMS API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: "agate"
      }
    }
  }));
  console.log("✓ Swagger UI enabled at /api-docs");
} else {
  console.log("✗ Swagger UI disabled (NODE_ENV=" + process.env.NODE_ENV + ")");
}

// API Routes
app.use("/api/auth", require("./entities/auth/auth.routes"));
app.use("/api/students", require("./entities/student/student.routes"));
app.use("/api/teachers", require("./entities/teacher/teacher.routes"));
app.use("/api/courses", require("./entities/course/course.routes"));
app.use("/api/classes", require("./entities/class/class.routes"));
app.use("/api/assessments", require("./entities/assessment/assessment.routes"));
app.use("/api/attendance", require("./entities/attendance/attendance.routes"));
app.use("/api/materials", require("./entities/material/material.routes"));
app.use("/api/dashboard", require("./entities/dashboard/dashboard.routes"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (isAppError(err)) {
    return sendError(res, err);
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
