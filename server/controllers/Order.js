const Order = require("../models/Order");

exports.create = async (req, res) => {
  try {
    const created = new Order(req.body);
    const createdOrder = await created.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error creating an order, please try again later");
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const order = await Order.find({ user: userId });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error("Order not found");
  }
};

// exports.orderById = async (req, res, next, id) => {
//   try {
//     const order = await Order.findByIdAndUpdate(id)
//       .populate("user", "_id name address")
//       .exec();

//     if (!order) {
//       res.status(404);
//       throw new Error("Order not found");
//     }

//     req.order = order;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     throw new Error(`${error}. An error occurred, please try again later`);
//   }
// };

// exports.read = async (req, res) => {
//   return res.status(200).json(req.order);
// };

// get status value

exports.getStatusValues = (req, res) => {
  res.status(200).json(Order.schema.path("status").enumValues);
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "_id name address")
      .exec();
    if (!orders) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. An error occurred, try again later`);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: { status: req.body.status },
      },
      { new: true }
    );
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(`${error}. An error occurred, try again later`);
  }
};
