const express = require("express");
const wishlistController = require("../controllers/Wishlist");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAuth } = require("../controllers/Auth");
const router = express.Router();

router
  .post("/:userId", verifyToken, isAuth, wishlistController.create)
  .get("/:userId", verifyToken, isAuth, wishlistController.getByUserId)
  .put("/:id/:userId", verifyToken, isAuth, wishlistController.updateById)
  .delete("/:id/:userId", verifyToken, isAuth, wishlistController.deleteById);

// router.use(verifyToken, isAuth);
module.exports = router;
