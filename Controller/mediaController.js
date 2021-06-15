const request = require("request");

exports.getImage = (req, res) => {
  let param = req.params[0];
  let diachi = "http://vaophim.com/" + param;
  const encodedURI = encodeURI(diachi);
  try {
    download(encodedURI, res, () => {});
  } catch (error) {
    res.status(400).json({
      status: "err",
      mess: error.message,
    });
  }
};
const download = function (uri, response, callback) {
  request.head(uri.trim(), function (err, res, body) {
    if (err) console.log(err);
    request(uri).pipe(response).on("close", callback);
  });
};

exports.getVideo = (req, res) => {
  const link = req.params[0];
  console.log(link);
  const fileUrl = encodeURI(`http://${link}`);
  console.log(fileUrl);
  try {
    let range = req.headers.range;
    if (!range) {
      throw new Error("Requires Range header");
    }

    let positions, start, end, total, chunksize;

    request(
      {
        url: fileUrl,
        method: "HEAD",
      },
      function (error, response, body) {
        if (error) console.log(error);
        let headers = response.headers;

        positions = range.replace(/bytes=/, "").split("-");
        start = parseInt(positions[0], 10);
        total = headers["content-length"];
        end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        chunksize = end - start + 1;

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });
        let options = {
          url: fileUrl,
          headers: {
            range: "bytes=" + start + "-" + end,
            connection: "keep-alive",
          },
        };

        request(options).pipe(res);
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
};
