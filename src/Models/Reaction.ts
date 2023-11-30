import { Schema, Document, model } from 'mongoose';

interface IReaction extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  emoji: Schema.Types.String;
}

const reactionSchema = new Schema<IReaction>(
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
    emoji: {
      // hexcode of emoji
      type: String,
      required: [true, 'Emoji hexcode is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Reaction = model<IReaction>('Reaction', reactionSchema);

export default Reaction;
