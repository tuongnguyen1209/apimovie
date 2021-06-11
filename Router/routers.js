const express = require("express");
const navController = require("../Controller/navController");
const movieController = require("../Controller/clawerMovieController");

const router = express.Router();

// router.route("/home").get(homeController.getAll);

router.route("/allnav").get(navController.getNav);

// router.route("/movie/:namemovie").get(movieController.getMovieInfo);

// router.route("/linkmovie/:namemovie").get(movieController.getLinkMovie);

// router.route("/linkMovie/:namemovie").get(movieController.getLinkMovie);

// router.route("/model/create").get(movieController.createMovie);

router.get("/name", (req, res) => {
  res.json({ hello: "hello" });
});

router.route("/getallmovie").post(movieController.getAllMovie);
router.route("/getlinkmovie").post(movieController.getLinkMovie);

module.exports = router;
