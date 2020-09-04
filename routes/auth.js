import { Router } from 'express';
import authController from '../controllers/authController';
import { catchAsync } from '../middlewares/errors';

export default () => {
  const api = Router();

  api.post('/signup', catchAsync(authController.signup));
  api.post('/signin', catchAsync(authController.signin));

  return api;
};
