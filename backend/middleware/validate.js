const { validationResult } = require('express-validator');

// Runs after express-validator chains; collects errors into one 400 response
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    return next(new Error(message));
  }
  next();
};

module.exports = validate;
