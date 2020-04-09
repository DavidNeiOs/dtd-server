import mongoose, { Schema, Document, Model, model } from "mongoose"
mongoose.Promise = global.Promise
import slug from "slug"

interface Tags { 
  WIFI: boolean
  OPEN_LATE: boolean
  FAMILY_FRIENDLY: boolean
  VEGETARIAN: boolean
  LICENSED: boolean
}

export interface StoreDoc extends Document {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  url: string
}

const StoreSchema: Schema = new mongoose.Schema({
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
  tags: [],
  url: String,
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      { 
        type: Number,
        required: 'You must supply coordinates!'
      }
    ],
    address: {
      type: String,
      required: 'You must supply an address'
    }
  }
})

StoreSchema.pre<StoreDoc>('save', async function(next) {
  if(!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);

  // find other store stores that have a slug store, store-1, store-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  // this is the right way of accessing the model here but ts throws an error
  //@ts-ignore
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx })

  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }

  next()
})

StoreSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 }}},
    { $sort: { count: -1 }}
  ]);
}

export interface StoreModel extends Model<StoreDoc> {
  getTagsList(): Promise<any>
}

export default model<StoreDoc, StoreModel>('Store', StoreSchema);