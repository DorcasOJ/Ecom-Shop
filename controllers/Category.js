const Category = require("../models/Category");

exports.getAll = async (req, res) => {
  try {
    const result = await Category.find({});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error fetching categories");
  }
};

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id).exec();
    if (!category) {
      res.status(400);
      throw new Error("Category does not exist");
    }
    req.category = category;
    next();
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(`${error}. An error occurred, try again later `);
  }
};

exports.read = async (req, res) => {
  return res.status(200).json(req.category);
};

exports.getBySearch = async (req, res) => {
  try {
    if (req.query.search) {
      const categories = await Category.find({
        name: { $regex: req.query.search, $options: "ims" },
      });
      if (!categories) {
        res.status(400);
        throw new Error("Category does not exist");
      }
      res.status(200).json(categories);
    } else {
      res.status(403);
      throw new Error("Search query not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. An error occurred`);
  }
};

exports.create = async (req, res) => {
  try {
    const category = new Category(req.body);
    const data = await category.save();
    res.status(201).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. An error occurred`);
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      { _id: req.category._id },
      { $set: { name: req.body.name } },
      { new: true }
    );
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("An error occurred, try again later");
  }
};

//@desc DEL one contact
//@route DEL /api/contact
//@access private
exports.remove = async (req, res) => {
  try {
    const category = req.category;
    req.category = undefined;
    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      message: "Category deleted",
    });
  } catch (error) {
    res.status(400);

    throw new Error(` ${error}. An error occurred, try again later`);
  }
};
