const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        error: { message: "Unauthorized" },
      });
    }

    const secret = process.env.JWT;
    const authToken = jwt.verify(token, secret);
    if (authToken) {
      req.user = authToken;
      next();
    } else {
      return res.status(401).json({
        error: { message: "Unauthorized" },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = isAuth;
