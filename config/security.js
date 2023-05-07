const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }

module.exports = { hashPassword ,comparePassword };