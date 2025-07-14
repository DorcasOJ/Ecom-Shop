const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  try {
    // extract token from req cookies
    const { token } = req.session;
    if (!token) {
      return res.status(401).json({
        message: `Token missing, please login again.`,
      });
    }

    // verify the token
    const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

    // check if decoded info contains legit details , then set it to req.user
    if (decodedInfo && decodedInfo._id && decodedInfo.email) {
      req.user = decodedInfo;
      const user = await User.findById(req.user._id);
      req.user = {
        ...req.user,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      };
      next();
    } else {
      // if token is invalid
      return res
        .status(401)
        .json({ message: "Invalid Token, please login again" });
    }
  } catch (error) {
    console.log(error);

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid Token, please login again" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
