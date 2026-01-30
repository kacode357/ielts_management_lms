// Course Level Seeder
const CourseLevel = require("../models/courseLevel.model");

const defaultLevels = [
  {
    name: "Foundation",
    code: "FOUNDATION",
    description: "For beginners, targeting band 4.0-5.0",
    order: 1,
  },
  {
    name: "Pre-Intermediate",
    code: "PRE_INTERMEDIATE",
    description: "For learners targeting band 5.0-5.5",
    order: 2,
  },
  {
    name: "Intermediate",
    code: "INTERMEDIATE",
    description: "For learners targeting band 5.5-6.0",
    order: 3,
  },
  {
    name: "Upper-Intermediate",
    code: "UPPER_INTERMEDIATE",
    description: "For learners targeting band 6.0-6.5",
    order: 4,
  },
  {
    name: "Advanced",
    code: "ADVANCED",
    description: "For learners targeting band 6.5-7.5",
    order: 5,
  },
  {
    name: "IELTS 5.5",
    code: "IELTS_5_5",
    description: "Target band 5.5",
    order: 6,
  },
  {
    name: "IELTS 6.5",
    code: "IELTS_6_5",
    description: "Target band 6.5",
    order: 7,
  },
  {
    name: "IELTS 7.0+",
    code: "IELTS_7_0_PLUS",
    description: "Target band 7.0 and above",
    order: 8,
  },
];

async function ensureDefaultCourseLevels() {
  try {
    let created = 0;
    let existing = 0;

    for (const level of defaultLevels) {
      const existingLevel = await CourseLevel.findOne({ code: level.code });

      if (existingLevel) {
        existing++;
        continue;
      }

      await CourseLevel.create({
        ...level,
        isActive: true,
      });
      created++;
    }

    if (created > 0) {
      console.log(`✓ Course Levels: ${created} created, ${existing} already existed`);
    }

    return { created, existing };
  } catch (error) {
    console.error("✗ Error creating default course levels:", error);
    throw error;
  }
}

module.exports = { ensureDefaultCourseLevels };
