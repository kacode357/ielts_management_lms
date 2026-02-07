// Swagger/OpenAPI documentation configuration
const swaggerJsdoc = require("swagger-jsdoc");

// Dynamic server URL based on environment
const getServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.API_URL || "https://api.ieltslms.com";
  }
  return `http://localhost:${process.env.PORT || 5000}`;
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IELTS Management LMS API",
      version: "1.0.0",
      description: "API documentation for IELTS Learning Management System",
      contact: {
        name: "API Support",
        email: "support@ieltslms.com",
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
