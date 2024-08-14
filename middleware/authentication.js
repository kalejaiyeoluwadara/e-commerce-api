const customError = require("../errors");
const { isTokenValid } = require("../utils");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    console.log("No token present");
    throw new customError.UnauthenticatedError("Authentication invalid");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError("Authentication invalid");
  }
};
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.Unauthorized("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
