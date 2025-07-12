const { generateToken } = require("./GenerateToken");
const { sanitizeUser } = require("./SanitizeUser");

exports.getSanitizedAndTokenizedUser = async (user, req) => {
  // getting secure user info
  const secureInfo = sanitizeUser(user);
  // generating jwt token
  const token = generateToken(secureInfo);

  // sending jwt token in the response cookie
  // res.cookie("token", token, {
  //   sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
  //   maxAge: new Date(
  //     Date.now() +
  //       parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
  //   ),
  //   httpOnly: true,
  //   secure: process.env.PRODUCTION === "true" ? true : false,
  //   // secure: true,
  // });

  // sending jwt token in the req session
  req.session.token = token;
  console.log(req.session, "login/signup");
  return secureInfo;
};
