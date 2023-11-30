const typeDefs = `
    type Follower {
        _id: String,
        follower: String,
        following: String,
        createdAt: Date,
        updatedAt: Date,
    }

    type Query {
        getFollower(_id: String!): [Follower],
        getFollowing(_id: String!): [Follower]
    }

    type Mutation {
        followUser(following: String!): Follower,
        unfollowUser(following: String!): Follower
    }
`;

export default typeDefs;
