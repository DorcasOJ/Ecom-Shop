const Address = require("../models/Address");

// exports.getAll = async (req, res) => {
//   try {
//     const addresses = await Address.find({});
//     res.status(200).json(addresses);
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     throw new Error("Error fetching address, please try again later");
//   }
// };

exports.create = async (req, res) => {
  try {
    const created = new Address(req.body);
    const createdAddress = await created.save();
    res.status(201).json(createdAddress);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error adding address, please try again later");
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error fetching address, please try again later");
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Address.find({ user: userId });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error fetching address, please try again later");
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error deleting address, please try again later");
  }
};
