const typeDefs = `
    type User{
        id: String,
        username: String
    }

    type Post{
        id: String,
        title: String,
    }

    type Query{
        searchUsers: [User],
        getPosts: [Post]
    }

    type Mutation{
        createUser: User
    }

    type Subscription{
        userCreated: User
    }
`;

export default typeDefs;
