import Message from '../../Models/Message';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {
  Query: {
    getMessages: async (_: any, { sender, receiver }: any) => {
      return await Message.find({ sender, receiver });
    },
  },
  Mutation: {
    sendMessage: async (_: any, { receiver, content }: any, context: any) => {
      const { user, pubsub } = context;
      console.log('send message payload => ', user._id, receiver, content);
      const message = new Message({
        sender: user._id,
        receiver,
        content,
      });
      const response = await message.save();
      pubsub.publish(`RECEIVE_MESSAGE`, { receiveMessage: response });
      return response;
    },
  },
  Subscription: {
    receiveMessage: {
      subscribe: withFilter(
        (_: any, __: any, context: any) => {
          const { pubsub } = context;
          return pubsub.asyncIterator([`RECEIVE_MESSAGE`]);
        },
        (payload, variables) => {
          return payload.receiveMessage.receiver.toString() === variables.user;
        }
      ),
    },
  },
};

export default resolvers;
