const User = require("../models/User");
const Otp = require("../models/OTP");
const { generateToken } = require("../utils/GenerateToken");
const {
  getSanitizedAndTokenizedUser,
} = require("../utils/GetSanitizedAndTokenizedUser");

const { sanitizeUser } = require("../utils/SanitizeUser");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../utils/GenerateOtp");
const { sendMail } = require("../utils/Emails");
const PasswordResetToken = require("../models/PasswordResetToken");

exports.signup = async (req, res) => {
  try {
    // const { name, email, password } = req.body;

    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({ message: "All fields are mandatory" });
    } else {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hashing password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      // create user
      const createdUser = new User(req.body);
      await createdUser.save();

      //   get sanitized and tokenized user
      const securedInfo = await getSanitizedAndTokenizedUser(createdUser, req);
      res.status(201).json(securedInfo);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    } else {
      const existingUser = await User.findOne({ email: req.body.email });

      const comparedPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );

      if (existingUser && comparedPassword) {
        console.log("tokenizing user...");
        const securedInfo = await getSanitizedAndTokenizedUser(
          existingUser,
          req
        );

        return res.status(200).json(securedInfo);
      } else {
        res.clearCookie("token");
        res.status(404);
        throw new Error("Invalid Credentials");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      `${error}. Some error occurred while logging in, please try again later`
    );
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.otp) {
      res.status(404).json({ message: "id and otp fields are mandatory" });
    }
    // check if user id is existing in the user collection
    const isValidUserId = await User.findById(req.body.userId);

    if (!isValidUserId) {
      return res.status(404).json({
        message: "User not Found, for which the otp has been generated",
      });
    }

    // check if otp exists by that user id
    const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });

    // if otp does not exist
    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found" });
    }

    // check if otp is expired, if yes delete
    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp has expired" });
    }

    // check if otp is there and matches the hash value then update the user verified status to true and return updated user
    const comparedOtp = await bcrypt.compare(req.body.otp, isOtpExisting.otp);
    if (isOtpExisting && comparedOtp) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      const verifiedUser = await User.findByIdAndUpdate(
        isValidUserId._id,
        { isVerified: true },
        { new: true }
      );
      return res.status(200).json(sanitizeUser(verifiedUser));
    }

    // in default case if none of the condition matches, then return this response
    return res.status(400).json({ message: "Otp is invalid or expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some Error occurred" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const existingUser = await User.findById(req.body.userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await Otp.deleteMany({ user: existingUser._id });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    console.log("otp", otp);

    const newOtp = new Otp({
      user: req.body.userId,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    await sendMail(
      existingUser.email,
      `OTP Verification for your ECOM Account`,
      `Your one-Time Password (OTP) for account verification is: <b>${otp}</b>.</br>Do not share this OTP with anyone for security reasons`
    );

    res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({
      message: `${error}. Some error occurred while resending otp, please try again later`,
    });
    console.log(error);
  }
};

exports.forgotPassword = async (req, res) => {
  let newToken;
  try {
    // check if user provided email exist or not
    const isExistingUser = await User.findOne({ email: req.body.email });

    // if email does not exist
    if (!isExistingUser) {
      return res
        .status(404)
        .json({ message: "Provided email does not exists" });
    }

    // if user exist, delete old token and generates a password reset token

    await PasswordResetToken.deleteMany({
      user: isExistingUser._id,
    });
    const resetToken = generateToken(sanitizeUser(isExistingUser), true);

    // hash the token
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // save hashed password reset token
    newToken = new PasswordResetToken({
      user: isExistingUser._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newToken.save();
    console.log(
      `${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${resetToken}`
    );

    // send password reset link to user's email

    await sendMail(
      isExistingUser.email,
      `Password Reset Lin for you ECOM Account`,
      `<p>Dear ${isExistingUser?.name},
        We received a request to reset the password for your ECOM account.
        If you initiated this request, please use the following link to reset your password:</p>

        <p>
        <a href=${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${resetToken} target="_blank">Reset Password</a>
        </p>

        <p>
        This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your account security is important to us.

        Thank you,
        The ECOM Team
        </p>
        `
    );

    res.status(200).json({
      message: `Password Reset link sent to ${isExistingUser.email}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while sending password reset mail" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // check if user exist or not
    const isExistingUser = await User.findById(req.body.userId);

    if (!isExistingUser) {
      return res.status(404).json({
        message: "User does not exists",
      });
    }

    // fetch the resetPasswordToken by the userId
    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: isExistingUser._id,
    });

    // if token does not exists for that userId
    if (!isResetTokenExisting) {
      return res.status(404).json({
        message: "Reset Link is Not Valid",
      });
    }

    // if token has expired then deletes token
    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({
        message: "Reset Link has been expired",
      });
    }

    // if token exist and it's not expired and matches hash
    const compareToken = await bcrypt.compare(
      req.body.token,
      isResetTokenExisting.token
    );

    if (
      isResetTokenExisting &&
      isResetTokenExisting.expiresAt > new Date() &&
      compareToken
    ) {
      // deleting token

      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

      // reset the password after hashing it
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(isExistingUser._id, {
        password: hashedPassword,
      });
      return res.status(200).json({ message: "password Updated Successfully" });
    }
    return res.status(404).json({ message: "Reset Link has expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error occurred while resetting the password, please try again later",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // res.cookie("token", {
    //   maxAge: 0,
    //   sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
    //   httpOnly: true,
    //   secure: process.env.PRODUCTION === "true" ? true : false,
    // });
    req.session.destroy((err) => {
      if (err) {
        console.error(error);
        return res.status(500).send("Logout Failed");
      }
    });
    res.clearCookie("connect.sid");
    res.status(200);
    res.send("Logged out successfully");
    // .json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.checkAuth = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);

      console.log(req.user);

      return res.status(200).json(sanitizeUser(user));
    }
    res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.makeUserAdmin = async (req, res) => {
  if (req.user) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { isAdmin: true } },
      { new: true }
    ).exec();
    res.status(200).json(sanitizeUser(user));
  } else {
    console.log(error);
    res.status(403);
    throw new Error("Access denied, not Admin");
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      res.status(403);
      throw new Error("Access denied, not Admin");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(403);

    throw new Error("Access denied, not Admin");
  }
};

exports.isAuth = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (req.user && req.user._id === userId) {
      next();
    } else {
      res.status(403);
      throw new Error("Access denied, kindly login");
    }
  } catch (error) {
    console.log(error);
    res.status(403);
    throw new Error("Access denied, kindly login");
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany({});

    return res.status(200).json({
      message: "All users deleted successfully",
      deletedUsersCount: deletedUsers.deletedCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error("An error occurred, try again later");
  }
};
