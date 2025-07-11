const express = require("express");
const addressController = require("../controllers/Address");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAuth } = require("../controllers/Auth");
const router = express.Router();

router
  .post("/:userId", verifyToken, isAuth, addressController.create)
  // .get("/all/:userId", addressController.getAll)
  .get("/user/:userId", verifyToken, isAuth, addressController.getByUserId)
  .put("/:id/:userId", verifyToken, isAuth, addressController.updateById)
  .delete("/:id/:userId", verifyToken, isAuth, addressController.deleteById);

// router.use(verifyToken, isAuth);
module.exports = router;
