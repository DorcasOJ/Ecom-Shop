const User = require("../models/User");

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = (await User.findById(id)).toObject();
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting your details, please try again later");
  }
};

exports.updateById = async (re, res) => {
  try {
    const { id } = req.params;
    const updated = (
      await User.findByIdAndUpdate(id, req.body, { new: true })
    ).toObject();
    delete updated.password;
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting your details, please try again later");
  }
};

exports.addOrderToUserHistory = async (req, res, next) => {
  let history = [];
};

exports.purchaseHistory = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
