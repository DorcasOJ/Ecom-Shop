const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

exports.create = async (req, res) => {
  try {
    const created = new Product(req.body);
    const createdUser = await created.save();
    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. Error adding product, please try again later`);
  }
};

exports.getAll = async (req, res) => {
  const order = req.query.order || "asc";
  const sortBy = req.query.sortBy || "_id";
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  let skip = 0;
  filter = {};

  if (req.query.category) {
    filter.category = { $in: req.query.category };
  }

  if (req.query.brand) {
    filter.brand = { $in: req.query.brand };
  }

  if (req.query.user) {
    filter["isDeleted"] = false;
  }
  if (req.query.page && Number(req.query.page) !== isNaN) {
    skip = limit * (req.query.page - 1);
  }

  // maybe add cat and brand later

  try {
    const totalDocs = await Product.find(filter)
      .sort([[sortBy, order]])
      .populate("brand")
      .countDocuments()
      .exec();
    const products = await Product.find(filter)
      // .populate("category")
      .sort([[sortBy, order]])
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .exec();
    if (!products) {
      res.status(404);
      throw new Error(" Product not found, try again later");
    }
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Error fetching Product`);
  }
};

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id)
      .populate("brand")
      .populate("category");
    if (!product) {
      res.status(400);
      throw new Error("Product not found");
    }
    req.product = product;
    next();
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      `${error}. Error getting product details, please try again later`
    );
  }
};

exports.read = async (req, res) => {
  return res.status(200).json(req.product);
};

// List related products based on category
exports.listRelatedCategory = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    const totalDocs = await Product.find({
      _id: { $ne: req.product._id },
      category: req.product.category._id,
    })
      .populate("category", "_id name")
      .populate("brand", "_id, name")
      .countDocuments()
      .exec();
    const products = await Product.find({
      _id: { $ne: req.product._id },
      category: req.product.category._id,
    })
      .limit(limit)
      .populate("category", "_id name")
      .populate("brand", "_id, name")
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Error fetching Product`);
  }
};

// List related products based on brand

exports.listRelatedBrand = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    const totalDocs = await Product.find({
      _id: { $ne: req.product._id },
      brand: req.product.brand._id,
    })
      .populate("category", "_id name")
      .populate("brand", "_id, name")
      .countDocuments()
      .exec();

    const products = await Product.find({
      _id: { $ne: req.product._id },
      brand: req.product.brand._id,
    })
      .limit(limit)
      .populate("category", "_id name")
      .populate("brand", "_id, name")
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Error fetching Product`);
  }
};

// List products by search
exports.listBySearch = async (req, res) => {
  const order = req.body.order || "desc";
  const sortBy = req.body.sortBy || "_id";
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  let findArgs = {};
  // let brandArgs = {};
  // let categoryArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else if (key === "title") {
        findArgs[key] = {
          $regex: `${req.body.filters[key]}`,
          $options: "i",
        };
      } else if (key === "category") {
        findArgs[key] = { $in: req.body.category };
      } else if (key === "brand") {
        findArgs[key] = { $in: req.body.brand };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const totalDocs = await Product.find(findArgs)
      .populate("category")
      .populate("brand")
      .countDocuments()
      .exec();
    const products = await Product.find(findArgs)
      .populate("category")
      .populate("brand")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();
    if (products.length > 0) {
      res.set("X-Total-Count", totalDocs);
      res.status(200).json(products);
    } else {
      findArgs.description = findArgs.title;
      delete findArgs.title;

      const totalDocsDesc = await Product.find(findArgs)
        .populate("category")
        .populate("brand")
        .countDocuments()
        .exec();
      const productFromDesc = await Product.find(findArgs)
        .populate("category")
        .populate("brand")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec();

      if (productFromDesc.length > 0) {
        res.set("X-Total-Count", totalDocsDesc);
        res.status(200).json(productFromDesc);
      } else {
        const category = await Category.find({
          name: { $regex: req.body.filters.title, $options: "ims" },
        });
        // console.log("cat", category, "desc", productFromDesc, "prod", products);

        delete findArgs.description;
        findArgs.category = { $in: [] };
        for (const cat of category) {
          findArgs.category.$in.push(cat);
        }
        const totalDocsCat = await Product.find(findArgs)
          .populate("category")
          .populate("brand")
          .countDocuments()
          .exec();

        const productFromCat = await Product.find(findArgs)
          .populate("category")
          .populate("brand")
          .sort([[sortBy, order]])
          .skip(skip)
          .limit(limit)
          .exec();

        if (productFromCat.length > 0) {
          res.set("X-Total-Count", totalDocsCat);
          res.status(200).json(productFromCat);
        } else {
          res.status(404);
          throw new Error("Product not found");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. An error occurred, try again later`);
  }
};

// List product search, query base and /or category id
exports.listSearchQuery = async (req, res) => {
  const query = {};
  if (req.query) {
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
      if (req.query.category && req.query.category !== "all") {
        query.category = req.query.category;
      }
    }

    try {
      const totalDocs = await Product.find(query)
        .populate("category")
        .countDocuments()
        .exec();
      const products = await Product.find(query).populate("category").exec();

      if (!products) {
        res.status(400);
        throw new Error(`Products not found`);
      }
      res.set("X-Total-Count", totalDocs);
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(400);
      throw new Error(`${error}. An error occurred, try again later`);
    }
  } else {
    res.status(403);
    throw new Error("Input search or category query");
  }
};

// Decrease product quantity after purchase
exports.decreaseQuantity = async (req, res, next) => {
  const bulkOPs = req.body.item.map((cart) => {
    let isDeleted = false;
    // console.log(
    //   cart.product.stockQuantity,
    //   cart.product.sold,
    //   cart.product.stockQuantity - cart.product.sold,
    //   "the nuumberrrr"
    // );
    // const stockLeft =;
    if (cart.product.stockQuantity - cart.product.sold < 2) {
      isDeleted = true;
    }

    return {
      updateOne: {
        filter: { _id: cart.product._id },
        update: {
          $inc: {
            stockQuantity: -1,
            sold: +1,
          },
          $set: { isDeleted: isDeleted },
        },
      },
    };
  });

  try {
    await Product.bulkWrite(bulkOPs, {});
    next();
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(`${error}. Could not update product`);
  }
};

// update product details and add images to existing product images
exports.update = async (req, res) => {
  const update = {};
  for (const key in req.body) {
    if (!req.body.hasOwnProperty(key)) continue;

    if (key === "images" && Array.isArray(req.body[key])) {
      update.$addToSet = { images: { $each: req.body.images } };
    } else {
      update.$set = update.$set || {};
      update.$set[key] = req.body[key];
    }
  }

  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.product._id,
      update,
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. Error update products, please try again later`);
  }
};

// delete one image from product images
exports.removeProductImage = async (req, res) => {
  console.log("product", req.product.images.includes(req.body.image));

  try {
    if (req.product.images.includes(req.body.image)) {
      const deleteImage = await Product.findByIdAndUpdate(
        req.product._id,
        { $pull: { images: req.body.image } },
        { new: true }
      );
      res.status(200).json(deleteImage);
    } else {
      res.status(404);
      throw new Error("Unable to delete, image URL not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(`${error}. Error update products, please try again later`);
  }
};

// List categories used in products
exports.categories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", {});
    // const categories = await Product.find({}, { category: 1, _id: 0 }).populate(
    //   "category",
    //   "_id, name"
    // );

    if (!categories) {
      res.status(404);
      throw new Error("Categories not found");
    }
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(
      `${error}. Error fetching categories, please try again later`
    );
  }
};

// List brands used in products
exports.brands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand", {});
    if (!brands) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json(brands);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Error fetch branding, please try again later`);
  }
};

// Restore products back
exports.undeleteById = async (req, res) => {
  try {
    const unDeleted = await Product.findByIdAndUpdate(
      req.product._id,
      { $set: { isDeleted: false } },
      { new: true }
    ).populate("brand");
    res.status(200).json(unDeleted);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(
      `${error}. Error restoring product, please try again later`
    );
  }
};

// delete product
exports.deleteById = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndUpdate(
      req.product._id,
      { $set: { isDeleted: true } },
      { new: true }
    ).populate("brand");
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. Error deleting product, please try again later`);
  }
};
