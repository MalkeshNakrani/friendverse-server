import { Schema, Document, model } from 'mongoose';

interface IPost extends Document {
  user: Schema.Types.ObjectId;
  content: String;
  contentType: String;
  caption: String;
  tags: Array<String>;
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video'],
      required: [true, 'Content type is required'],
    },
    caption: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Post = model<IPost>('Post', postSchema);

export default Post;
