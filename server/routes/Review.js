const express = require("express");
const reviewController = require("../controllers/Review");
const { isAuth, isAdmin } = require("../controllers/Auth");
const { verifyToken } = require("../middleware/VerifyToken");
const router = express.Router();

router

  .post("/create/:userId", verifyToken, isAuth, reviewController.create)
  .get("/all", reviewController.getAllReviews)

  // product Id
  .get("/:id", reviewController.getByProductId)

  .patch(
    "/update/:id/:userId",
    verifyToken,
    isAuth,
    reviewController.updateById
  )
  .delete(
    "/delete/:id/:userId",
    verifyToken,
    isAuth,
    reviewController.deleteById
  );

module.exports = router;
