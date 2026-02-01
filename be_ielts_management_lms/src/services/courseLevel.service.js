// Course Level Service - Business Logic Layer
const CourseLevel = require("../models/courseLevel.model");
const { AppError } = require("../utils/appError");

class CourseLevelService {
  /**
   * Create a new course level (Admin only)
   * @param {Object} data - Level data
   * @returns {Promise<Object>} Created level
   */
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

  /**
   * Get all course levels
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} List of levels
   */
  async getLevels(options = {}) {
    const { isActive, includeInactive = false } = options;

    const query = {};
    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive === "true" || isActive === true;
    }

    const levels = await CourseLevel.find(query).sort({ order: 1, name: 1 });

    return levels;
  }

  /**
   * Get course level by ID
   * @param {string} levelId - Level ID
   * @returns {Promise<Object>} Level data
   */
  async getLevelById(levelId) {
    const level = await CourseLevel.findById(levelId);
    if (!level) {
      throw new AppError("Course level not found", 404);
    }
    return level;
  }

  /**
   * Update course level (Admin only)
   * @param {string} levelId - Level ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated level
   */
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

    const updatedLevel = await CourseLevel.findByIdAndUpdate(
      levelId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedLevel;
  }

  /**
   * Delete course level (soft delete)
   * @param {string} levelId - Level ID
   * @returns {Promise<Object>} Deleted level
   */
  async deleteLevel(levelId) {
    const level = await CourseLevel.findById(levelId);
    if (!level) {
      throw new AppError("Course level not found", 404);
    }

    // Soft delete
    level.isActive = false;
    await level.save();

    return level;
  }

  /**
   * Reorder course levels
   * @param {Array} levelOrders - Array of { id, order }
   * @returns {Promise<Array>} Updated levels
   */
  async reorderLevels(levelOrders) {
    const bulkOps = levelOrders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));

    await CourseLevel.bulkWrite(bulkOps);

    return this.getLevels({ includeInactive: false });
  }

  /**
   * Get course levels for dropdown (simplified format)
   * @returns {Promise<Array>} Array of { id, name, code }
   */
  async getLevelsForDropdown() {
    const levels = await CourseLevel.find({ isActive: true })
      .select("_id name code")
      .sort({ order: 1, name: 1 });

    return levels;
  }
}

module.exports = new CourseLevelService();
