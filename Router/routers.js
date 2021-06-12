const express = require("express");
const navController = require("../Controller/navController");
const movieController = require("../Controller/clawerMovieController");

const router = express.Router();


router.route("/allnav").get(navController.getNav);



router.get("/name", (req, res) => {
  res.json({ hello: "hello" });
});

router.route("/getallmovie").post(movieController.getAllMovie);
router.route("/getlinkmovie").post(movieController.getLinkMovie);

module.exports = router;
