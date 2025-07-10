const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require("../middleware/VerifyToken");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/check-auth", verifyToken, authController.checkAuth);
router.put("/make-user-admin", verifyToken, authController.makeUserAdmin);
router.get("/logout", authController.logout);

router.get("/all-users", authController.allUsers);
router.delete("/delete-all-users", authController.deleteAllUsers);

module.exports = router;
