export const notFound = (req, res, next) => {
  const err = new Error('404 page not found');
  err.status = 404;
  next(err);
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export const catchErrors = (err, req, res, next) => {
  let errorMessage = '';

  switch (err.message) {
    case 'jwt expired':
      errorMessage = 'Session expired!';
      break;
    case 'No authorization token was found':
      errorMessage = 'Session expired!';
      break;
    default:
      errorMessage = err.message;
      break;
  }

  res.status(err.status || 500);
  res.json({
    message: errorMessage,
  });
};
