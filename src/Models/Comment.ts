import { Schema, Document, model } from 'mongoose';
interface IComment extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  content: Schema.Types.String;
  contentType: Schema.Types.String;
}

const comentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>('Comment', comentSchema);

export default Comment;
