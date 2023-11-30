const typeDefs = `
    type Message {
        _id: String,
        sender: String,
        receiver: String,
        content: String, 
        createdAt: Date,
        updatedAt: Date
    }

    type Query {
        getMessages(sender: String!, receiver: String!): [Message]
    }

    type Mutation {
        sendMessage(receiver: String!, content: String!): Message,
    }

    type Subscription {
        receiveMessage(user: String!): Message
    }
`;

export default typeDefs;
