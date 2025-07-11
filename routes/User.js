const express = require("express");
const userController = require("../controllers/User");
const router = express.Router();

router.get("/:id", userController.getById);
router.patch("/:id", userController.updateById);

module.exports = router;
