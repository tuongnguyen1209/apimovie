const express = require("express");
const movieController = require("./../Controller/movieController");

const routerMovie = express.Router();

routerMovie
  .route("/movie")
  .get(movieController.getAll)
  .post(movieController.insertMany);

module.exports = routerMovie;
