const express = require("express");
const productController = require("../controllers/Product");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAuth, isAdmin } = require("../controllers/Auth");
const router = express.Router();

router
  .post(
    "/product/create/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    productController.create
  )
  .post("/products/search", productController.listBySearch)

  .get("/products", productController.getAll)
  .get("/product/:productId", productController.read)
  .put("/product/update/:productId/:userId", productController.update)
  .put(
    "/product/delete-image/:productId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    productController.removeProductImage
  )
  .put(
    "/product/delete-product/:productId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    productController.deleteById
  )
  .put(
    "/product/restore-product/:productId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    productController.undeleteById
  )
  .get("/products/brands", productController.brands)
  .get("/products/categories", productController.categories)
  .get("/product/related-brand/:productId", productController.listRelatedBrand)
  .get(
    "/product/related-category/:productId",
    productController.listRelatedCategory
  )
  .get("/products/search-query", productController.listSearchQuery)

  

router.param("productId", productController.productById);

module.exports = router;
