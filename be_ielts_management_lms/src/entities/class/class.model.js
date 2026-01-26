// Class Model (Course Instance/Batch)
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const Course = require("../course/course.model");
const Teacher = require("../teacher/teacher.model");

/**
 * @openapi
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         courseId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         className:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         schedule:
 *           type: string
 *         status:
 *           type: string
 */
const Class = sequelize.define(
  "Class",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teachers",
        key: "id",
      },
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Class schedule (e.g., Mon/Wed/Fri 18:00-20:00)",
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "ongoing", "completed", "cancelled"),
      defaultValue: "scheduled",
    },
  },
  {
    tableName: "classes",
    timestamps: true,
  }
);

// Associations
Class.belongsTo(Course, { foreignKey: "courseId", as: "course" });
Class.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacher" });
Course.hasMany(Class, { foreignKey: "courseId", as: "classes" });
Teacher.hasMany(Class, { foreignKey: "teacherId", as: "classes" });

module.exports = Class;
