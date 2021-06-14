const movieSchema = require("../Model/movieSchema");
const stringSimilarity = require("string-similarity");

exports.insertMany = (req, res) => {
  // console.log("them nhieu phi,");
  let listmovie = req.body.listmovie;
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
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );

    let queryFinal = JSON.parse(queryStr);
    if (queryFinal.title) {
      let str = queryFinal.title;
      str = str.split("(")[0];
      queryFinal.title = new RegExp(str, "mi");
    }
    // console.log(queryFinal);
    let query = movieSchema.find(queryFinal);

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

    // console.log(size);
    // pagination

    const getExec = await query.exec();
    const numDoc = getExec.length;

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    // console.log(numDoc, limit);

    if (req.query.page) {
      if (skip >= numDoc) throw new Error("This page not exist");
    }

    //excute query
    const listMovie = await query;

    res.status(200).json({
      status: "success",
      results: listMovie.length,
      maxPage: Math.ceil(numDoc / limit),
      data: {
        listMovie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error.message,
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

exports.getCountry = async (req, res) => {
  try {
    const countries = await movieSchema.aggregate([
      { $unwind: "$listCountries" },
      { $project: { _id: 0, listCountries: 1 } },
      {
        $group: {
          _id: "$listCountries.country",
          tags: { $sum: 1 },
        },
      },
      { $project: { _id: 0, country: "$_id", tags: 1 } },
      { $sort: { tags: -1 } },
      { $match: { tags: { $gte: 10 } } },
    ]);

    res.status(200).json({
      status: "success",
      results: countries.length,
      data: {
        countries,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};

exports.searchMovie = async (req, res) => {
  try {
    let keyword = req.query.keyword;
    if (!keyword) throw new Error("Missing keyword");
    let listTitleMovie = await movieSchema.find().select("-_id title");

    let listTitle = listTitleMovie.map((obj) => {
      let strName = obj.title;
      return strName;
    });
    let matchedTitle = stringSimilarity.findBestMatch(`${keyword}`, listTitle);
    console.log(matchedTitle.bestMatch.target);
    let result = [];
    matchedTitle.ratings.forEach((element) => {
      if (element.rating > 0)
        result.push({
          target: element.target,
          rating: element.rating,
        });
    });

    result.sort((a, b) => b.rating - a.rating);
    result = result.slice(0, 5);
    res.status(200).json({
      message: "Success",
      result: result.length,
      data: {
        result,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed",
      err: error.message,
    });
  }
};
