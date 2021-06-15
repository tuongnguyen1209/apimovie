const express = require("express");
const movieController = require("./../Controller/movieController");
const mediaController = require("./../Controller/mediaController");

const routerMedia = express.Router();

routerMedia.route("/img/*").get(mediaController.getImage);
routerMedia.route("/video/*").get(mediaController.getVideo);

module.exports = routerMedia;
