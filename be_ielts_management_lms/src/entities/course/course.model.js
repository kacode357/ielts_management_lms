// Course Model
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         level:
 *           type: string
 *         duration:
 *           type: integer
 *         price:
 *           type: number
 */
const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Target IELTS level (e.g., 5.0-6.0, 6.5-7.5)",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Course duration in weeks",
    },
    totalHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Total teaching hours",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    syllabus: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Course syllabus or outline",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

module.exports = Course;
