import Post from '../../Models/Post';

const resolvers = {
  Query: {
    searchUsers: () => {
      console.log('searchUsers');
    },
    getPosts: async () => {
      console.log('get posts');
      return await Post.find();
    },
  },
  Mutation: {
    createUser: () => {},
  },
  Subscription: {
    userCreated: {
      subscribe: () => {},
    },
  },
};
export default resolvers;
