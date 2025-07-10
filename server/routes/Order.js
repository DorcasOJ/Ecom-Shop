const express = require("express");
const orderController = require("../controllers/Order");
const productController = require("../controllers/Product");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAuth, isAdmin } = require("../controllers/Auth");
const router = express.Router();

router
  .post(
    "/order/create/:userId",
    verifyToken,
    isAuth,
    productController.decreaseQuantity,
    orderController.create
  )

  .get("/orders/:userId", verifyToken, isAuth, isAdmin, orderController.getAll)

  .get("/order/user/:userId", verifyToken, isAuth, orderController.getByUserId)

  .get("/order/status-values", orderController.getStatusValues)

  .patch(
    "/order/:id/status/:userId",
    verifyToken,
    isAuth,
    orderController.updateOrderStatus
  );

//
// router.param("id", orderController.orderById);

module.exports = router;
