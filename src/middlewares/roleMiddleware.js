const checkRole = (roles) => (req, res, next) => {
  if (!req.session || !req.session.role) {
    return res
      .status(401)
      .json({ error: 'Unauthorized access. Please log in.' });
  }

  if (!roles.includes(req.session.role)) {
    return res
      .status(403)
      .json({ error: 'Access denied. Insufficient privileges.' });
  }

  next();
};

module.exports = { checkRole };
