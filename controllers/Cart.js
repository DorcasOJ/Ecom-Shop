const Cart = require("../models/Cart");

exports.create = async (req, res) => {
  try {
    const created = await new Cart(req.body).populate({
      path: "product",
      populate: { path: "brand" },
    });
    const createdCart = await created.save();
    res.status(201).json(createdCart);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error adding product to cart, please try again later");
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Cart.find({
      user: userId,
    }).populate({ path: "product", populate: { path: "brand" } });

    if (!result) {
      res.status(400);
      throw new Error("Cart not found");
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting product from cart, please try again later");
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate({ path: "product", populate: { path: "brand" } });

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error updating product in cart, please try again later");
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cart.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error del product from cart, please try again later");
  }
};

exports.deleteByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Cart.deleteMany({ user: userId });
    res.status(204).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting product from cart, please try again later");
  }
};
