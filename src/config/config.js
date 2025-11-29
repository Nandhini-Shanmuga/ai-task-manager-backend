module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this',
  JWT_EXPIRES_IN: '24h',
  BCRYPT_SALT_ROUNDS: 10
};
