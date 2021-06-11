const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  titleEnglish: {
    type: String,
  },
  year: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  listCountries: {
    type: Array,
    default: [],
  },
  listactors: {
    type: Array,
    default: [],
  },
  listCategories: {
    type: Array,
    default: [],
  },
  directors: {
    type: String,
    default: "",
  },
  contents: {
    type: String,
    default: "",
  },
  listChaps: {
    type: Array,
    default: [],
  },
  trailer: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("movie", movieSchema);
