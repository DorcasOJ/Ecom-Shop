const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("CartItem", cartItemSchema);
