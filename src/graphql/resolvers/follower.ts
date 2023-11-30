import Follower from '../../Models/Follower';
import User from '../../Models/User';
import { GraphQLError } from 'graphql/error';
import isError from '../../utils/isError';

const resolvers = {
  Query: {
    getFollower: async (_: any, { _id }: any) => {
      console.log('Get followers of user => ', _id);
      return await Follower.find({ following: _id });
    },
    getFollowing: async (_: any, { _id }: any) => {
      console.log('Get following of user => ', _id);
      return await Follower.find({ follower: _id });
    },
  },
  Mutation: {
    followUser: async (_: any, { following }: any, context: any) => {
      try {
        // we need to get current user from context
        const { user } = context;
        const followingUser = await User.findById(following);
        if (!followingUser) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'USER_NOT_FOUND',
            },
          });
        }

        const addFollowing = new Follower({
          follower: user?._id,
          following: following,
        });

        const response = await addFollowing.save();
        return response;
      } catch (err) {
        const error = isError(err);
        console.log('Error in following user => ', error.name, error.message);
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
    unfollowUser: async (_: any, { following }: any, context: any) => {
      try {
        const { user } = context;
        const followingUser = await Follower.findOneAndDelete({
          follower: user?._id,
          following: following,
        });
        return followingUser;
      } catch (err) {
        const error = isError(err);
        console.log('Error in un-following user => ', error.message);
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
  },
};

export default resolvers;
