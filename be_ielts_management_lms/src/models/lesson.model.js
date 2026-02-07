// Lesson Model - MongoDB Driver
const { getCollection, ObjectId } = require("../db/mongoose");

const COLLECTION_NAME = "lessons";

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         moduleId: { type: string }
 *         title: { type: string }
 *         type: { type: string }
 *         content: { type: string }
 *         videoUrl: { type: string }
 *         orderIndex: { type: number }
 *         isPublished: { type: boolean }
 */

async function create(data) {
  const collection = await getCollection(COLLECTION_NAME);
  
  data.createdAt = new Date();
  data.updatedAt = new Date();
  
  if (!data.isPublished) data.isPublished = true;
  
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
  const { sort = { orderIndex: 1 }, limit, skip } = options;
  
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
