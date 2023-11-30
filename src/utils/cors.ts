// GraphQL route cors configuration

var whitelist = [process.env.FRONTEND_URL, 'https://sandbox.embed.apollographql.com'];

const graphQlSandboxConfiguration = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const appCorsConfiguration = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

export { graphQlSandboxConfiguration, appCorsConfiguration };
