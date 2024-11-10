const jwt = require("jsonwebtoken");

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const tokenCheck = req.headers.authorization;

  if (!tokenCheck) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = tokenCheck.split(" ")[1];

  // Verify the token is valid
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
    // Attach the decoded user information to the request object
    req.body.email = decoded.email;

    return next();
  });
};

module.exports = { verifyToken };
