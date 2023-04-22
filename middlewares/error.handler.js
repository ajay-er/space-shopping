function handleError(res, error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}

function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).send({ message: 'File is too large!' });
  } else {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong' });
  }
  next(err);
}

module.exports = { handleError, multerErrorHandler };
