import { Router } from 'express';
import tacticsController from '../controllers/tacticsController';

import { catchAsync } from '../middlewares/errors';
import { checkJwt } from '../middlewares/auth';

export default () => {
  const api = Router();

  api.get('/:id', catchAsync(tacticsController.findOne));
  api.get('/', catchAsync(tacticsController.findAll));
  api.post('/', checkJwt, catchAsync(tacticsController.create));

  return api;
};
