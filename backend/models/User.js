import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'vip', 'admin'], default: 'user' },
    password: { type: String, required: true }
});

export default mongoose.model("User", userSchema);