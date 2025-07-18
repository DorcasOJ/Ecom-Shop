const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    item: {
      type: [Schema.Types.Mixed],
      required: true,
    },

    address: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Dispatched",
        "Out for delivery",
        "Cancelled",
        "Not processed",
      ],
      default: "Not processed",
    },
    paymentMode: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
