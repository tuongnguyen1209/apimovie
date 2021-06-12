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

exports.getAll = async (req, res) => {
  //loc theo the loai
  //loc theo nam
  //gio han, pangination

  try {
    //fiter theo gia tri
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = movieSchema.find(JSON.parse(queryStr));

    //sortting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    //field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).limit(limit);

    if (req.query.page) {
      const numDoc = await movieSchema.countDocuments();
      if (skip >= numDoc) throw new Error("This page not exist");
    }

    //excute query
    const listMovie = await query;

    res.status(200).json({
      status: "success",
      results: listMovie.length,
      data: {
        listMovie,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};

exports.getmovie = async (req, res) => {
  try {
    const _id = req.params._id;
    const movie = await movieSchema.findById(_id);

    res.status(200).json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      mess: error,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await movieSchema.aggregate([
      { $unwind: "$listCategories" },
      { $project: { _id: 0, listCategories: 1 } },
      {
        $group: {
          _id: "$listCategories.nameCate",
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};
