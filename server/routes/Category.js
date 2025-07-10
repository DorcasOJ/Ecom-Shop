const express = require("express");
const categoryController = require("../controllers/Category");
const { isAdmin, isAuth } = require("../controllers/Auth");
const { verifyToken } = require("../middleware/VerifyToken");
const router = express.Router();

router
  .get("/categories", categoryController.getAll)

  .post(
    "/category/create/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    categoryController.create
  )

  .get("/category/:categoryId", categoryController.read)

  .get("/categories/search", categoryController.getBySearch)

  .put(
    "/category/update/:categoryId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    categoryController.update
  )

  .delete(
    "/category/delete/:categoryId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    categoryController.remove
  );

router.param("categoryId", categoryController.categoryById);
module.exports = router;
