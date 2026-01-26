// Enrollment Model (Student enrollment in classes)
const { DataTypes } = require("sequelize");
const sequelize = require("../../db/sequelize");
const Student = require("../student/student.model");
const Class = require("../class/class.model");

const Enrollment = sequelize.define(
  "Enrollment",
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
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "dropped", "suspended"),
      defaultValue: "active",
    },
    finalGrade: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
    completionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "enrollments",
    timestamps: true,
  }
);

// Associations
Enrollment.belongsTo(Student, { foreignKey: "studentId", as: "student" });
Enrollment.belongsTo(Class, { foreignKey: "classId", as: "class" });
Student.belongsToMany(Class, { through: Enrollment, foreignKey: "studentId", as: "enrolledClasses" });
Class.belongsToMany(Student, { through: Enrollment, foreignKey: "classId", as: "enrolledStudents" });

module.exports = Enrollment;
