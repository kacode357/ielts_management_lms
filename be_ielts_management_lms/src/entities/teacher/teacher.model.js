// Teacher Model
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const User = require("../auth/auth.model");

/**
 * @openapi
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         teacherCode:
 *           type: string
 *         specialization:
 *           type: string
 *         experience:
 *           type: integer
 *         bio:
 *           type: string
 */
const Teacher = sequelize.define(
  "Teacher",
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
    teacherCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Teaching specialization (e.g., Speaking, Writing, All skills)",
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Years of teaching experience",
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Teaching certifications (CELTA, TESOL, etc.)",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
  }
);

// Associations
Teacher.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Teacher, { foreignKey: "userId", as: "teacherProfile" });

module.exports = Teacher;
