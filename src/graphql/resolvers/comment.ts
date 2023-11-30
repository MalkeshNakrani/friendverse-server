import Comment from '../../Models/Comment';
import { GraphQLError } from 'graphql';
import Post from '../../Models/Post';

const resolvers = {
  Query: {
    getComment: async (_: any, { _id }: any) => {
      console.log('get comment');
      return await Comment.findById(_id);
    },
    getComments: async (_: any, { post }: any) => {
      console.log('get comments');
      return await Comment.find({ post });
    },
  },
  Mutation: {
    postComment: async (_: any, { post, content, contentType }: any, context: any) => {
      const { pubsub, user } = context;
      console.log('post comment', user._id, post, content, contentType);
      const isPostEx = await Post.findById(post);
      if (!isPostEx) {
        throw new GraphQLError('Post not exist', {
          extensions: {
            code: 'NO_POST',
          },
        });
      }
      const comment = new Comment({
        user: user._id,
        post,
        content,
        contentType,
      });
      await comment.save();
      pubsub.publish('COMMENT_CREATED', { commentCreated: comment });
      return comment;
    },
    updateComment: async (_: any, { _id, content }: any, context: any) => {
      const { user } = context;
      const isCommentEx = await Comment.findById(_id);
      if (!isCommentEx) {
        throw new GraphQLError('Comment not exist', {
          extensions: {
            code: 'NO_COMMENT',
          },
        });
      }
      if (isCommentEx.user !== user._id) {
        throw new GraphQLError('Comment not belong to user', {
          extensions: {
            code: 'NO_COMMENT',
          },
        });
      }
      const comment = await Comment.updateOne({ _id }, { content });
      return comment;
    },
    deleteComment: async (_: any, { _id }: any, context: any) => {
      const { user } = context;
      const isCommentEx = await Comment.findById(_id);
      if (!isCommentEx) {
        throw new GraphQLError('Comment not exist', {
          extensions: {
            code: 'NO_COMMENT',
          },
        });
      }
      if (isCommentEx.user !== user._id) {
        throw new GraphQLError('Comment not belong to user', {
          extensions: {
            code: 'NO_COMMENT',
          },
        });
      }
      const comment = await Comment.findByIdAndDelete(_id);
      return comment;
    },
  },
  Subscription: {
    commentCreated: {
      subscribe: (_: any, __: any, { pubsub }: any) => {
        return pubsub.asyncIterator('COMMENT_CREATED');
      },
    },
  },
};

export default resolvers;
