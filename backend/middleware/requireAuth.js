const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify user authentication

  const { authorization } = req.headers;
  console.log(req.headers)
  if (!authorization) {
    return res.status(401).json({
      error:
        "You are not authorized to access this resource (from requireAuth)",
      token: authorization,
    });
  }

  //* Token is of the form "Bearer token"
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    if (!req.user) {
      return res
        .status(404)
        .json({ error: "User not found and hence not authorized" });
    }
    // the ID of the user
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Request is not authorized" });
  }
};

module.exports = requireAuth;
