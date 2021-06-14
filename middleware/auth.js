const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "sadfpojopqwrknsdf";

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: "fail",
      mess: "Access token not found",
    });

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    console.log(decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "fail",
      mess: "Invalid token",
    });
  }
};

module.exports = verifyToken;
