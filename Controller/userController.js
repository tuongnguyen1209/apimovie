const argon2 = require("argon2");
const userSchema = require("./../Model/userSchema");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "sadfpojopqwrknsdf";

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    res.status(400).json({
      status: "fail",
      mess: "Missing username or password",
    });

  try {
    const user = await userSchema.findOne({ username });
    if (user)
      return res.status(400).json({
        status: "fail",
        mess: "Username already exists!!!",
      });

    const hashPassword = await argon2.hash(password);

    const newuser = await userSchema.create({
      username,
      password: hashPassword,
    });

    const accessToken = jwt.sign({ userId: newuser._id }, ACCESS_TOKEN_SECRET);

    res.status(200).json({
      status: "success",
      mess: "Register Successful",
      accessToken,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      mess: error,
    });
  }
};

exports.login = async (req, res) => {
  // let username = "",
  //   password = "";
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({
      status: "fail",
      mess: "Missing username or password",
    });

  try {
    const user = await userSchema.findOne({ username });
    if (!user)
      return res.status(400).json({
        status: "fail",
        mess: "Invalid username or password!!!",
      });

    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid)
      return res.status(400).json({
        status: "fail",
        mess: "Invalid username or password!!!",
      });

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET);
    res.status(200).json({
      status: "success",
      mess: "Login Successfull!!!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userSchema.findById(userId).select("-password");
    if (!user)
      return res.status(400).json({
        status: "fail",
        mess: "User not found",
      });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      mess: "Internal server  error",
    });
  }
};
