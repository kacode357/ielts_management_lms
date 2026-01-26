// Attendance Model
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const Student = require("../student/student.model");
const Class = require("../class/class.model");

const Attendance = sequelize.define(
  "Attendance",
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
      allowNull: false,
      references: {
        model: "classes",
        key: "id",
      },
    },
    attendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "late", "excused"),
      allowNull: false,
      defaultValue: "present",
    },
    sessionNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Session/lesson number",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "attendances",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "classId", "attendanceDate"],
      },
    ],
  }
);

// Associations
Attendance.belongsTo(Student, { foreignKey: "studentId", as: "student" });
Attendance.belongsTo(Class, { foreignKey: "classId", as: "class" });
Student.hasMany(Attendance, { foreignKey: "studentId", as: "attendances" });
Class.hasMany(Attendance, { foreignKey: "classId", as: "attendances" });

module.exports = Attendance;
