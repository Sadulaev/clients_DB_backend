export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clients-db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
  },
});
