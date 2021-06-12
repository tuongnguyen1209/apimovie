const express = require("express");
const movieController = require("./../Controller/movieController");

const routerMovie = express.Router();

routerMovie
  .route("/movie")
  .get(movieController.getAll)
  .post(movieController.insertMany);

routerMovie.route("/movie/:_id").get(movieController.getmovie);

routerMovie.route("/categories").get(movieController.getCategories);

module.exports = routerMovie;
