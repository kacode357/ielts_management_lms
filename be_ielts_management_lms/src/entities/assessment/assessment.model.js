// Assessment Model (Tests and Scores)
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const Student = require("../student/student.model");
const Class = require("../class/class.model");

/**
 * @openapi
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         studentId:
 *           type: integer
 *         classId:
 *           type: integer
 *         assessmentType:
 *           type: string
 *         listeningScore:
 *           type: number
 *         readingScore:
 *           type: number
 *         writingScore:
 *           type: number
 *         speakingScore:
 *           type: number
 *         overallBand:
 *           type: number
 */
const Assessment = sequelize.define(
  "Assessment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "classes",
        key: "id",
      },
    },
    assessmentType: {
      type: DataTypes.ENUM("placement", "progress", "mock", "final"),
      allowNull: false,
    },
    assessmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    listeningScore: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 9,
      },
    },
    readingScore: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 9,
      },
    },
    writingScore: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 9,
      },
    },
    speakingScore: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 9,
      },
    },
    overallBand: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 9,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    weaknesses: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "assessments",
    timestamps: true,
  }
);

// Associations
Assessment.belongsTo(Student, { foreignKey: "studentId", as: "student" });
Assessment.belongsTo(Class, { foreignKey: "classId", as: "class" });
Student.hasMany(Assessment, { foreignKey: "studentId", as: "assessments" });
Class.hasMany(Assessment, { foreignKey: "classId", as: "assessments" });

module.exports = Assessment;
