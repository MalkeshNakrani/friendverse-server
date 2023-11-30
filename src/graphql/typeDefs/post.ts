const typeDefs = `
    type Post {
        _id: String,
        userId: String,
        content: String,
        contentType: String,
        caption: String,
        tags: [String],
        likes: [String],
        comments: [String],
        createdAt: String,
        updatedAt: String,
    }

    type Query {
        getPost(_id: String!): Post,
        getPosts(userId: String): [Post],
    }

    type Mutation {
        createPost(content: String!, contentType: String!, caption: String, tags: [String]): Post,
        updatePost(_id: String!, content: String, caption: String, tags: [String]): Post,
        deletePost(_id: String!): Post,
    }
    
    type Subscription {
        postCreated: Post,
        postUpdated: Post,
    }
    
`;

export default typeDefs;
