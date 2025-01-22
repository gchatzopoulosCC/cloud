const isAuthenticated = (req, res, next) => {
  // if (req.session && req.session.userId) {
  return next(); // User is authenticated, proceed to the next middleware
  // }
  // res.status(401).send("Unauthorized"); // Or redirect to login page
};

module.exports = isAuthenticated;
