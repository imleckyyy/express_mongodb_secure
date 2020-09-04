import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (user) => {
  const token = jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
      iss: 'api.dropback',
      aud: 'api.dropback',
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' },
  );
  return token;
};

export const hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};

export const verifyPassword = (passwordAttempt, hashedPassword) => {
  const isValid = bcrypt.compare(passwordAttempt, hashedPassword);
  return isValid;
};
