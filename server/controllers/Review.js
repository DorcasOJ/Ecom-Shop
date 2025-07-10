const Review = require("../models/Review");

exports.create = async (req, res) => {
  try {
    const created = new Review(req.body);
    const createdReviews = await created.save();

    res.status(200).json(createdReviews);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(` ${error} Error posting review, please try again later`);
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting reviews, please try again later");
  }
};

exports.getByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const pageSize = req.query.limit;
      const page = req.query.page;

      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Review.find({ product: id })
      .countDocuments()
      .exec();
    const result = await Review.find({ product: id })
      .skip(skip)
      .limit(limit)
      .populate("user", "_id, name")
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error posting review, please try again later");
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error posting review, please try again later");
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error posting review, please try again later");
  }
};
