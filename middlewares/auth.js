import jwt from 'express-jwt';
import jwtDecode from 'jwt-decode';

export const attachUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  const decodedToken = jwtDecode(token);

  if (!decodedToken) {
    return res.status(401).json({ message: 'There was a problem authorizing request' });
  }

  req.user = decodedToken;
  return next();
};

export const checkJwt = jwt({
  secret: process.env.JWT_SECRET,
  issuer: 'api.dropback',
  audience: 'api.dropback',
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
});

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Insufficient role' });
  }

  return next();
};
