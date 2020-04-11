import mongoose, { Schema, model, Document, Model } from "mongoose"
mongoose.Promise = global.Promise
import md5 from 'md5'
import validator from 'validator'

interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
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
    required: true
  }
});

export interface UserModel extends Model<UserDoc> {
}

export default model<UserDoc, UserModel>('User', userSchema)