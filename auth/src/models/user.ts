import mongoose, {HydratedDocument} from "mongoose";
import { Password } from '../utils';

// An Interface used to describe the properties
// required to create a user
interface UserAttrs {
  email: string;
  password: string;
};

// type representing the user document created
type UserDoc = HydratedDocument<UserAttrs>;

// An interface used to describe what properties
// a User model can have
interface UserModel extends mongoose.Model<UserAttrs> {
  build(attrs: UserAttrs): UserDoc;
};


// Mongoose User Schema
const userSchema = new mongoose.Schema<UserAttrs, UserModel>({
	email: {
    type: String,
    required: true
  },
	password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
    versionKey: false
  }
});

// Prior to save
userSchema.pre('save', async function(done) {
  // Will be true first time
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

// static methods on User model
userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

// Mongoose User Model
const User: UserModel = mongoose.model<UserAttrs, UserModel>('User', userSchema);

export { User };