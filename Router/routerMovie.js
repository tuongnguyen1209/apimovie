const express = require("express");
const movieController = require("./../Controller/movieController");

const routerMovie = express.Router();

routerMovie
  .route("/movie")
  .get(movieController.getAll)
  .post(movieController.insertMany);

routerMovie.route("/movie/:_id").get(movieController.getmovie);

routerMovie.route("/country").get(movieController.getCountry);
routerMovie.route("/search").get(movieController.searchMovie);

module.exports = routerMovie;
