const express = require("express");
const router = express.Router();
const cartController = require("../controllers/Cart");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAuth } = require("../controllers/Auth");

router
  .post("/create/:userId", verifyToken, isAuth, cartController.create)
  .get("/user/:userId", verifyToken, isAuth, cartController.getByUserId)
  .put("/user/:id/:userId", verifyToken, isAuth, cartController.updateById)
  .delete("/user/:id/:userId", verifyToken, isAuth, cartController.deleteById)
  .delete("/user/:userId", verifyToken, isAuth, cartController.deleteByUserId);
module.exports = router;
