// Student Model
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const User = require("../auth/auth.model");

/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         studentCode:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         currentLevel:
 *           type: string
 *         targetBand:
 *           type: number
 *           format: float
 *         enrollmentDate:
 *           type: string
 *           format: date
 */
const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    studentCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    currentLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Current IELTS level (e.g., Beginner, Intermediate, Advanced)",
    },
    targetBand: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 6.5,
      validate: {
        min: 0,
        max: 9,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Additional notes about the student",
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

// Associations
Student.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Student, { foreignKey: "userId", as: "studentProfile" });

module.exports = Student;
