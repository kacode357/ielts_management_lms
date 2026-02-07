// Swagger/OpenAPI documentation configuration
const swaggerJsdoc = require("swagger-jsdoc");

// Dynamic server URL based on environment
const getServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.API_URL || "http://localhost:5000";
  }
  return `http://localhost:${process.env.PORT || 5000}`;
};

// Contact info from environment
const getContactEmail = () => process.env.API_SUPPORT_EMAIL || "support@example.com";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: process.env.API_TITLE || "IELTS Management LMS API",
      version: process.env.API_VERSION || "1.0.0",
      description: process.env.API_DESCRIPTION || "API documentation for IELTS Learning Management System",
      contact: {
        name: "API Support",
        email: getContactEmail(),
      },
    },
    servers: [
      {
        url: getServerUrl(),
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            details: {
              type: "object",
              nullable: true,
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/app.js",
    "./src/controllers/**/*.js",
    "./src/routes/**/*.js",
    "./src/models/**/*.js",
  ],
};

// Function to regenerate swagger spec (for hot reload)
const generateSwaggerSpec = () => {
  return swaggerJsdoc(options);
};

module.exports = generateSwaggerSpec();
