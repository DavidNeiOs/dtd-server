import mongoose, { Schema, Document, Model, model } from "mongoose"
mongoose.Promise = global.Promise
import md5 from 'md5'
import validator from 'validator'
import mongodbErrorHandler from "mongoose-mongodb-errors"
import passportLocalMongoose from 'passport-local-mongoose'

interface UserDoc extends Document {
  name: string;
  email: string;
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
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

export interface UserModel extends Model<UserDoc> {}

export default model<UserDoc, UserModel>('User', userSchema)