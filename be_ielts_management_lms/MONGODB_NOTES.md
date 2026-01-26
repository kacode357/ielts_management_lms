# Notes on MongoDB Integration

## Migration from Sequelize to Mongoose

All models have been converted from Sequelize (SQL) to Mongoose (MongoDB):

### Model Files
- `*.model.js` - Original Sequelize models (kept for reference)
- `*.model.mongoose.js` - New Mongoose models (currently in use)

### Key Changes

1. **IDs**: Changed from auto-increment integers to MongoDB ObjectIds
   - `id` → `_id`
   - Foreign keys now use `mongoose.Schema.Types.ObjectId`

2. **Relationships**: 
   - Sequelize associations → Mongoose `ref` and `populate()`
   - Many-to-many through tables → separate collection with compound indexes

3. **Validation**:
   - Sequelize validators → Mongoose schema validation
   - `allowNull: false` → `required: true`

4. **Methods**:
   - Instance methods work similarly in both
   - Static methods can be added to schema

5. **Queries**:
   - `findByPk()` → `findById()`
   - `findOne({ where: {...} })` → `findOne({...})`
   - `create()` works the same
   - `update()` → `save()` after modifying fields

### Database Connection
- Connection string: `mongodb://localhost:27017/ielts_lms_db`
- No need to create database manually - MongoDB creates it automatically
- Collections are created when first document is inserted

### Running the Application
```bash
# Make sure MongoDB is running
mongosh

# Install dependencies (mongoose instead of sequelize/pg)
npm install

# Run the server
npm run dev
```

The application will connect to MongoDB and auto-create collections as needed.
