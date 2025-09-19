import mongoose, { Schema, Document } from 'mongoose';

// create type interface for ArticalSchema
interface IArticle extends Document {
  title: string;
  category: string;
  body: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Creting a Schema for moongose database
const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  body: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// export both schema and Artical
export default mongoose.model<IArticle>('Article', ArticleSchema);