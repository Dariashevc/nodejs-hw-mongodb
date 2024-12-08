export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  if (status === 500) {
    console.error('Internal Server Error:', err);
  }


  res.status(status).json({
    status,
    message,
    
  });
};
