import jwtDecode from 'jwt-decode';
import User from '../models/User';
import { createToken, hashPassword, verifyPassword } from '../utils';

export default {
  async signup(req, res) {
    try {
      const { login: loginInput, email: emailInput, password: passwordInput } = req.body;

      const hashedPassword = await hashPassword(passwordInput);

      const userData = {
        login: loginInput,
        email: emailInput.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      };

      const existingEmail = await User.findOne({
        email: userData.email,
      }).lean();

      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = new User(userData);
      const savedUser = await newUser.save();

      if (!savedUser) {
        return res.status(400).json({
          message: 'There was a problem creating your account',
        });
      }

      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { login, email, role } = savedUser;

      const userInfo = {
        login,
        email,
        role,
      };

      res.cookie('token', token, {
        httpOnly: true,
      });

      return res.json({
        message: 'User created!',
        // token,
        userInfo,
        expiresAt,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'There was a problem creating your account',
      });
    }
  },

  async signin(req, res) {
    try {
      const { email: bodyEmail, password: bodyPassword } = req.body;

      const user = await User.findOne({
        email: bodyEmail,
      }).lean();

      if (!user) {
        return res.status(403).json({
          message: 'Wrong email or password.',
        });
      }

      const passwordValid = await verifyPassword(bodyPassword, user.password);

      if (!passwordValid) {
        return res.status(403).json({
          message: 'Wrong email or password.',
        });
      }

      const { password, ...rest } = user;
      const userInfo = { ...rest };

      const token = createToken(userInfo);

      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true,
      });

      return res.json({
        message: 'Authentication successful!',
        // token,
        userInfo,
        expiresAt,
      });
    } catch (err) {
      return res.status(400).json({ message: 'Something went wrong.' });
    }
  },
};
