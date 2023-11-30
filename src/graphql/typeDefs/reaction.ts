const typeDefs = `
    type Reaction {
        _id: String,
        user: String,
        post: String,
        emoji: String,
        createdAt: String,
        updatedAt: String,
    }

    type Query {
        getReactions(post: String!): [Reaction],
    }

    type Mutation {
        postReaction(post: String!, emoji: String!): Reaction,
        deleteReaction(_id: String!): Reaction,
    }

    type Subscription {
        reactionCreated: Reaction,
    }
`;

export default typeDefs;
