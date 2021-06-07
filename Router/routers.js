const express = require("express");
const homeController = require("../Controller/homeController");
const navController = require("../Controller/navController");
const movieController = require("./../Controller/movieController");

const router = express.Router();

router.route("/home").get(homeController.getAll);

router.route("/allnav").get(navController.getNav);

router.route("/movie/:namemovie").get(movieController.getMovieInfo);

router.route("/linkmovie/:namemovie").get(movieController.getLinkMovie);

router.route("/all/:link1/:link2?").get(movieController.getAllMovie);

module.exports = router;
