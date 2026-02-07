// Course Level Model - MongoDB Driver
const { getCollection, ObjectId } = require("../db/mongoose");

const COLLECTION_NAME = "course_levels";

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseLevel:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         code: { type: string }
 *         description: { type: string }
 *         order: { type: number }
 *         isActive: { type: boolean }
 */

async function create(data) {
  const collection = await getCollection(COLLECTION_NAME);
  
  data.createdAt = new Date();
  data.updatedAt = new Date();
  
  if (!data.order) data.order = 0;
  if (!data.isActive) data.isActive = true;
  if (data.code) data.code = data.code.toUpperCase();
  
  const result = await collection.insertOne(data);
  return { ...data, _id: result.insertedId };
}

async function findById(id) {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function findOne(query) {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.findOne(query);
}

async function find(query = {}, options = {}) {
  const collection = await getCollection(COLLECTION_NAME);
  const { sort = { order: 1, name: 1 }, limit, skip } = options;
  
  let cursor = collection.find(query).sort(sort);
  
  if (skip) cursor = cursor.skip(skip);
  if (limit) cursor = cursor.limit(limit);
  
  return await cursor.toArray();
}

async function updateById(id, data) {
  const collection = await getCollection(COLLECTION_NAME);
  
  data.updatedAt = new Date();
  delete data._id;
  
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  
  return await findById(id);
}

async function deleteById(id) {
  const collection = await getCollection(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

async function count(query = {}) {
  const collection = await getCollection(COLLECTION_NAME);
  return await collection.countDocuments(query);
}

module.exports = {
  create,
  findById,
  findOne,
  find,
  updateById,
  deleteById,
  count,
  COLLECTION_NAME,
  ObjectId
};
