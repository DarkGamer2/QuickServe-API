import { Schema,model,Document } from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`)

interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    created_at:Date,
    updated_at:Date,
    skillSet:string[],
    role:string,
    comparePassword: (password:string)=>Promise<boolean>
}
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    created_at: Date,
    updated_at: Date,
    skillSet: [String],
    role: String
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === 'string') {
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
  
  userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password);
  };
  
  const User = model<IUser>('User', userSchema);

export default User;