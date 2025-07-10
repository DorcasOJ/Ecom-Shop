const Brand = require("../models/Brand");

exports.getAll = async (req, res) => {
  try {
    const result = await Brand.find({});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching brands");
  }
};

exports.getBySearch = async (req, res) => {
  try {
    if (req.query.search) {
      const brands = await Brand.find({
        name: { $regex: req.query.search, $options: "ims" },
      });
      if (!brands) {
        res.status(404);
        throw new Error("Product not found");
      }
      res.status(200).json(brands);
    } else {
      res.status(403);
      throw new Error("Search query not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error && error}. An error occurred, try again later`);
  }
};

exports.brandById = async (req, res, next, id) => {
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404);
      throw new Error("brand does not exist");
    }
    req.brand = brand;
    next();
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. An error occurred, try again later`);
  }
};

exports.read = async (req, res) => {
  return res.status(200).json(req.brand);
};

exports.create = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const data = await brand.save();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. An error occurred, try again later.`);
  }
};

exports.update = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.brand._id,
      { $set: { name: req.body.name } },
      { new: true }
    );
    res.status(200).json(brand);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Could not update brand, try again later`);
  }
};

exports.remove = async (req, res) => {
  try {
    console.log(req.brand);
    const deletedBrand = await Brand.deleteOne({ _id: req.brand._id });
    res.status(200).json({ message: "Brand deleted", deleted: deletedBrand });
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. could not deleted brand, try again later`);
  }
};
