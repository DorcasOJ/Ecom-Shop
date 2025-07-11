const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");

exports.create = async (req, res) => {
  try {
    const created = await new Wishlist(req.body).populate({
      path: "product",
      populate: ["brand"],
    });
    const createdWishlist = await created.save();
    res.status(201).json(createdWishlist);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error adding product to wishlist, please try again later");
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const pageSize = req.query.limit;
      const page = req.query.page;

      skip = pageSize * (page - 1);
      limit = pageSize;
    }
    const result = await Wishlist.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate({ path: "product", populate: ["brand"] })
      .exec();
    const totalResults = await Wishlist.find({ user: userId })
      .countDocuments()
      .exec();

    res.set("X-Total-Count", totalResults);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      "Error getting product from wishlist, please try again later"
    );
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Wishlist.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("product");
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      "Error updating product to wishlist, please try again later"
    );
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Wishlist.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      "Error deleting product to wishlist, please try again later"
    );
  }
};
