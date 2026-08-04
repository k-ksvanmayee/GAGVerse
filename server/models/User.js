import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (pw) {
  this.passwordHash = bcrypt.hashSync(pw, 10);
};

userSchema.methods.checkPassword = function (pw) {
  return bcrypt.compareSync(pw, this.passwordHash);
};

export default mongoose.model('User', userSchema);
