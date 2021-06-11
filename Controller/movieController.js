const movieSchema = require("../Model/movieSchema");

exports.insertMany = (req, res) => {
  // console.log("them nhieu phi,");
  let listmovie = req.body.listmovie;
  console.log(listmovie);
  movieSchema
    .insertMany(listmovie)
    .then(() => {
      res.status(201).json({
        status: "success",
        mess: "Insert scuccessful!",
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: "fail",
        mess: "Insert fail",
        err: err,
      });
    });
};

exports.getAll = (req, res) => {
  const listMovie = movieSchema.find();
  res.status(200).json({
    status: "success",
    data: listMovie,
  });
};
