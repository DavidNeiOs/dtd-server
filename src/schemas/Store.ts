import mongoose from "mongoose"
mongoose.Promise = global.Promise
import slug from "slug"

interface StoreDoc extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  tags: string[];
}

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name for the store'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
})

storeSchema.pre<StoreDoc>('save', function(next) {
  if(!this.isModified('name')) {
    next();
    return;
  }

  // TODO: make slugs unique
  this.slug = slug(this.name);
  next()
})

export default storeSchema;