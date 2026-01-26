// Application-wide constants and error messages
const MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    REGISTER: "Registration successful",
    CREATED: "Created successfully",
    UPDATED: "Updated successfully",
    DELETED: "Deleted successfully",
    RETRIEVED: "Retrieved successfully",
  },
  ERROR: {
    INTERNAL_SERVER_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    VALIDATION_ERROR: "Validation error",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    INVALID_TOKEN: "Invalid or expired token",
    MISSING_TOKEN: "Authentication token is required",
    STUDENT_NOT_FOUND: "Student not found",
    TEACHER_NOT_FOUND: "Teacher not found",
    COURSE_NOT_FOUND: "Course not found",
    CLASS_NOT_FOUND: "Class not found",
    ASSESSMENT_NOT_FOUND: "Assessment not found",
    INVALID_BAND_SCORE: "Band score must be between 0 and 9 in 0.5 increments",
    CLASS_FULL: "Class has reached maximum capacity",
    DUPLICATE_ENROLLMENT: "Student is already enrolled in this class",
  },
  VALIDATION: {
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Invalid email format",
    INVALID_PASSWORD: "Password must be at least 8 characters",
    INVALID_PHONE: "Invalid phone number format",
    INVALID_DATE: "Invalid date format",
  },
};

module.exports = MESSAGES;
