const mongoose = require("mongoose");
const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
