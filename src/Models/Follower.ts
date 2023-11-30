import { model, Schema, Document } from 'mongoose';

interface IFollower extends Document {
  follower: Schema.Types.ObjectId;
  following: Schema.Types.ObjectId;
  type: String;
}

const followerSchema = new Schema<IFollower>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Follower is required'],
    },
    following: {
      type: Schema.Types.ObjectId,
      required: [true, 'Following is required'],
    },
    type: {
      type: String,
      enum: ['User', 'Page'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// This index will maintain uniqueness of combination of following and followers
followerSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follower = model<IFollower>('Follower', followerSchema);

export default Follower;
