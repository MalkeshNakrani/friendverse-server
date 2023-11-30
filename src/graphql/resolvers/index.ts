import merge from 'lodash.merge';
import usersResolvers from './user';
import postsResolvers from './post';
import followeResolvers from './follower';
import commentResolvers from './comment';
import reactionResolvers from './reaction';
import messageResolvers from './message';
import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString(); // Convert outgoing Date to ISOString for JSON
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

const customeDataTypeResolver = {
  Date: dateScalar,
};

const resolvers = merge(
  {},
  usersResolvers,
  postsResolvers,
  followeResolvers,
  customeDataTypeResolver,
  commentResolvers,
  reactionResolvers,
  messageResolvers
);
// const resolvers = merge({}, usersResolvers, postsResolvers, commentsResolvers);

export default resolvers;
