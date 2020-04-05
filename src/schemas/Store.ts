import mongoose from "mongoose"
mongoose.Promise = global.Promise
import slug from "slug"

interface Tags { 
  WIFI: boolean
  OPEN_LATE: boolean
  FAMILY_FRIENDLY: boolean
  VEGETARIAN: boolean
  LICENSED: boolean
}

interface StoreDoc extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  tags: Tags;
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
  tags: {
    WIFI: Boolean,
    OPEN_LATE: Boolean,
    FAMILY_FRIENDLY: Boolean,
    VEGETARIAN: Boolean,
    LICENSED: Boolean,
  }
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