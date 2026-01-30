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
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
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
app.use("/api/auth", require("./routes/auth.routes"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errors: [],
  });
});

// Global Error Handler - Standard format
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle operational errors (AppError)
  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ? [{ message: err.message, field: err.details }] : [],
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(key => ({
      message: err.errors[key].message,
      field: key
    }));
    return res.status(400).json({
      success: false,
      message: null,
      errors,
    });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errors: [{ message: `${field} already exists`, field }],
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: [],
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      errors: [],
    });
  }

  // Default error response for unknown errors
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
    errors: [],
  });
});

module.exports = app;
