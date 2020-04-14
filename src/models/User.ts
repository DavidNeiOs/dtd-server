import mongoose, { Schema, model, Document, Model } from "mongoose"
mongoose.Promise = global.Promise
import md5 from 'md5'
import validator from 'validator'

export interface UserDoc extends Document {
  _id: string
  name: string;
  email: string;
  password: string;
  gravatar: string
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
},
{
  toJSON: {
    virtuals: true
  }
});

userSchema.virtual('gravatar').get(function(this: UserDoc) {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200d=retro`
})

export interface UserModel extends Model<UserDoc> {
}

export default model<UserDoc, UserModel>('User', userSchema)