import mongoose from 'mongoose';

// Create user schema 
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true }
});

// also export user schema
export default mongoose.model('User', userSchema);