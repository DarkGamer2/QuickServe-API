import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`);

// Updated IUser interface
interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  skillSet: string[];
  role: string;
  comparePassword: (password: string) => Promise<boolean>;
  profilePic: string;
  _id: mongoose.Schema.Types.ObjectId;  // Use ObjectId instead of string for _id
}

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  skillSet: { type: [String], default: [] },
  role: { type: String, default: 'user' },
  profilePic: { type: String, default: '' },
}, { timestamps: true });  // Mongoose automatically adds `createdAt` and `updatedAt` fields

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
