// Middleware to check user roles
const checkRole = (roles) => (req, res, next) => {
  if (!req.session || !req.session.role) {
    return res.status(401).send('Unauthorized');
  }

  if (!roles.includes(req.session.role)) {
    return res.status(403).send('Access denied');
  }

  next();
};

module.exports = { checkRole };
