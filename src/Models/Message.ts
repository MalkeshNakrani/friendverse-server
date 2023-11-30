import { Schema, Document, model } from 'mongoose';

interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  content: String;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    content: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage>('Message', messageSchema);

export default Message;
