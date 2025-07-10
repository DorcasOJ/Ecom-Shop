const express = require("express");
const brandController = require("../controllers/Brand");
const { verifyToken } = require("../middleware/VerifyToken");
const { isAdmin, isAuth } = require("../controllers/Auth");
const router = express.Router();

router
  .get("/brands", brandController.getAll)

  .get("/brand/:brandId", brandController.read)

  .get("/brands/search", brandController.getBySearch)

  .post(
    "/brand/create/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    brandController.create
  )
  .put(
    "/brand/update/:brandId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    brandController.update
  )

  .delete(
    "/brand/delete/:brandId/:userId",
    verifyToken,
    isAuth,
    isAdmin,
    brandController.remove
  );

router.param("brandId", brandController.brandById);

module.exports = router;
