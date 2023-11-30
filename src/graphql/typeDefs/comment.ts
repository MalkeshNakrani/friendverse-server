const typeDefs = `
    type Comment {
        _id: String,
        user: String,
        post: String,
        content: String,
        contentType: String,
        createdAt: String,
        updatedAt: String,
    }

    type Query {
        getComment(_id: String!): Comment,
        getComments(post: String!): [Comment],
    }

    type Mutation {
        postComment(post: String!, content: String!, contentType: String!): Comment,
        updateComment(_id: String!, content: String): Comment,
        deleteComment(_id: String!): Comment,
    }

    type Subscription {
        commentCreated: Comment,
    }
`;

export default typeDefs;
