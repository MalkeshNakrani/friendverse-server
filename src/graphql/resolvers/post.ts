import mongoose from 'mongoose';
import Post from '../../Models/Post';
import { GraphQLError } from 'graphql';

const resolvers = {
  Query: {
    getPost: async (_: any, { _id }: any) => {
      console.log('get post');
      return await Post.findById(_id);
    },
    getPosts: async (_: any, { userId }: any) => {
      console.log('get posts');
      return await Post.find({ user: userId });
    },
  },
  Mutation: {
    //context type need to be created later
    createPost: async (_: any, { content, contentType, caption, tags }: any, context: any) => {
      const { pubsub, user } = context;
      console.log('create post', user._id, content, contentType, caption, tags);
      const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        content,
        contentType,
        caption,
        tags,
      });
      await post.save();
      pubsub.publish('POST_CREATED', { postCreated: post });
      return post;
    },
    updatePost: async (_: any, { _id, content, caption, tags }: any, context: any) => {
      const { pubsub, user } = context;
      console.log('update post', _id, content, caption, tags);
      const postExists = await Post.findById(_id);
      if (!postExists) {
        throw new GraphQLError('Post not exist', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      if (postExists.user !== user._id) {
        throw new GraphQLError('Post not belong to user', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      const post = await Post.findByIdAndUpdate(_id, { content, caption, tags }, { new: true });
      pubsub.publish('POST_UPDATED', { postUpdated: post });
      return post;
    },
    deletePost: async (_: any, { _id }: any, context: any) => {
      const { pubsub, user } = context;
      console.log('delete post', _id);
      const postExists = await Post.findById(_id);
      if (!postExists) {
        throw new GraphQLError('Post not exist', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      if (postExists.user !== user._id) {
        throw new GraphQLError('Post not belong to user', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      const post = await Post.findByIdAndDelete(_id);
      return post;
    },
  },
  Subscription: {
    postCreated: {
      //context type need to be created later
      subscribe: (_: any, __: any, context: any) => {
        const { pubsub } = context;
        console.log('subscription', pubsub);
        return pubsub.asyncIterator(['POST_CREATED']);
      },
    },
    postUpdated: {
      //context type need to be created later
      subscribe: (_: any, __: any, context: any) => {
        const { pubsub } = context;
        console.log('subscription', pubsub);
        return pubsub.asyncIterator(['POST_UPDATED']);
      },
    },
  },
};
export default resolvers;
