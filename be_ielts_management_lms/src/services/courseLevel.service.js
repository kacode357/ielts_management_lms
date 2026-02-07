// Course Level Service - MongoDB Driver
const CourseLevel = require("../models/courseLevel.model");
const { getCollection } = require("../db/mongoose");
const { AppError } = require("../utils/appError");

class CourseLevelService {
  async createLevel(data) {
    const { name, code, description, order } = data;

    // Validate required fields
    if (!name || !code) {
      throw new AppError("Name and code are required", 400);
    }

    // Check if code already exists
    const existing = await CourseLevel.findOne({ code: code.toUpperCase() });
    if (existing) {
      throw new AppError("Course level code already exists", 409);
    }

    const level = await CourseLevel.create({
      name,
      code: code.toUpperCase(),
      description,
      order: order || 0,
      isActive: true,
    });

    return level;
  }

  async getLevels(options = {}) {
    const { isActive, includeInactive = false } = options;

    const query = {};
    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive === "true" || isActive === true;
    }

    const levels = await CourseLevel.find(query, { sort: { order: 1, name: 1 } });

    return levels;
  }

  async getLevelById(levelId) {
    const level = await CourseLevel.findById(levelId);
    if (!level) {
      throw new AppError("Course level not found", 404);
    }
    return level;
  }

  async updateLevel(levelId, updateData) {
    const level = await CourseLevel.findById(levelId);
    if (!level) {
      throw new AppError("Course level not found", 404);
    }

    // If updating code, check for duplicates
    if (updateData.code && updateData.code.toUpperCase() !== level.code) {
      const existing = await CourseLevel.findOne({ code: updateData.code.toUpperCase() });
      if (existing) {
        throw new AppError("Course level code already exists", 409);
      }
      updateData.code = updateData.code.toUpperCase();
    }

    await CourseLevel.updateById(levelId, updateData);
    return await CourseLevel.findById(levelId);
  }

  async deleteLevel(levelId) {
    const level = await CourseLevel.findById(levelId);
    if (!level) {
      throw new AppError("Course level not found", 404);
    }

    // Soft delete
    await CourseLevel.updateById(levelId, { isActive: false });

    return { message: "Course level deleted" };
  }

  async reorderLevels(levelOrders) {
    const collection = await getCollection("course_levels");

    for (const { id, order } of levelOrders) {
      await collection.updateOne(
        { _id: id },
        { $set: { order } }
      );
    }

    return await this.getLevels({ includeInactive: false });
  }

  async getLevelsForDropdown() {
    const levels = await CourseLevel.find({ isActive: true });

    return levels.map(level => ({
      id: level._id,
      name: level.name,
      code: level.code,
    }));
  }
}

module.exports = new CourseLevelService();
