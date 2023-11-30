import Reaction from '../../Models/Reaction';
import { GraphQLError } from 'graphql';
import Post from '../../Models/Post';

const resolvers = {
  Query: {
    getReactions: async (_: any, { post }: any) => {
      console.log('get reactions');
      return await Reaction.find({ post });
    },
  },
  Mutation: {
    postReaction: async (_: any, { post, emoji }: any, context: any) => {
      const { pubsub, user } = context;
      console.log('post reaction', user._id, post, emoji);
      const isPostEx = await Post.findById(post);
      if (!isPostEx) {
        throw new GraphQLError('Post not exist', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      const reaction = new Reaction({
        user: user._id,
        post,
        emoji,
      });
      await reaction.save();
      pubsub.publish('REACTION_CREATED', { reactionCreated: reaction });
      return reaction;
    },
    deleteReaction: async (_: any, { _id }: any, context: any) => {
      const { user } = context;
      const isReactionEx = await Reaction.findById(_id);
      if (!isReactionEx) {
        throw new GraphQLError('Reaction not exist', {
          extensions: {
            code: 'NO_REACTION',
          },
        });
      }
      if (isReactionEx.user !== user._id) {
        throw new GraphQLError('Reaction not belong to user', {
          extensions: {
            code: 'NO_REACTION',
          },
        });
      }
      const reaction = await Reaction.findByIdAndDelete(_id);
      return reaction;
    },
  },
  Subscription: {
    reactionCreated: {
      subscribe: (_: any, __: any, { pubsub }: any) => pubsub.asyncIterator('REACTION_CREATED'),
    },
  },
};

export default resolvers;
