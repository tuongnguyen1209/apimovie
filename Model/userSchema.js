const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
  hobby: {
    type: Array,
  },
});

module.exports = mongoose.model("user", userSchema);
