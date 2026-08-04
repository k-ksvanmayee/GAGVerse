import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 60 },
    text: { type: String, trim: true, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 2000 },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    category: { type: String, default: 'Other' },
    tags: [{ type: String, trim: true }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

postSchema.index({ title: 'text' });

export default mongoose.model('Post', postSchema);
