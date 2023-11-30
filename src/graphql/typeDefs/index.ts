import userTypeDefs from './user';
import postTypeDefs from './post';
import followerTypeDefs from './follower';
import commentTypeDefs from './comment';
import reactionTypeDefs from './reaction';
import messageTypeDefs from './message';

const customDataTypes = `
    scalar Date
`;

const typeDefs = [
  userTypeDefs,
  postTypeDefs,
  followerTypeDefs,
  customDataTypes,
  commentTypeDefs,
  reactionTypeDefs,
  messageTypeDefs,
];

export default typeDefs;
