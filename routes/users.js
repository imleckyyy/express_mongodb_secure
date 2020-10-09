import { Router } from 'express';
import usersController from '../controllers/usersController';

import { catchAsync } from '../middlewares/errors';
import { checkJwt, requireAdmin } from '../middlewares/auth';

export default () => {
  const api = Router();

  api.get('/:login', catchAsync(usersController.findOne));
  api.get('/', checkJwt, requireAdmin, catchAsync(usersController.findAll));

  return api;
};
