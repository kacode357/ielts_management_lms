// Material Model (Learning Materials)
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const Course = require("../course/course.model");
const Teacher = require("../teacher/teacher.model");

const Material = sequelize.define(
  "Material",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    materialType: {
      type: DataTypes.ENUM("document", "video", "audio", "link", "exercise"),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL or file path",
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "File size in bytes",
    },
    skill: {
      type: DataTypes.ENUM("listening", "reading", "writing", "speaking", "general", "all"),
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "materials",
    timestamps: true,
  }
);

// Associations
Material.belongsTo(Course, { foreignKey: "courseId", as: "course" });
Material.belongsTo(Teacher, { foreignKey: "teacherId", as: "uploadedBy" });
Course.hasMany(Material, { foreignKey: "courseId", as: "materials" });
Teacher.hasMany(Material, { foreignKey: "teacherId", as: "uploadedMaterials" });

module.exports = Material;
