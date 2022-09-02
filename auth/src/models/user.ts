import mongoose, {HydratedDocument} from "mongoose";

// An Interface used to describe the properties
// required to create a user
interface UserAttrs {
  email: string;
  password: string;
};

// An interface used to describe what properties
// a User model can have
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
};

// An interface that describe the properties
// that a User Document has 
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema<UserAttrs>({
	email: {
    type: String,
    required: true
  },
	password: {
    type: String,
    required: true
  }
});

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user = User.build({
  email: 'test@test.com',
  password: "1231"
});

export { User };