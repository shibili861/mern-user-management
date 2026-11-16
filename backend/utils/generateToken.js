// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // jwt.sign takes 3 things: the data (payload), the secret key, and options (like expiration)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // This token will expire in 30 days
  });
};

export default generateToken;