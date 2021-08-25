const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const routers = require("./Router/routers");
const DATABASE = require("./Database/DatabaseConfig");
const events = require("events");
const routerMovie = require("./Router/routerMovie");
const routerUser = require("./Router/userRouter");
const routerMedia = require("./Router/mediaRouter");

const PORT = process.env.PORT || 7300;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

const DB = DATABASE.DATABASE.replace("<PASSWORD>", DATABASE.PASSWORD);

events.EventEmitter.defaultMaxListeners = 50;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connect successful!!!");
  });

//router
app.use("/apis/v1", routers);
app.use("/apis/v2", routerMovie);
app.use("/apis/v2/user", routerUser);
app.use("/media/", routerMedia);

const server = app.listen(PORT, () => {
  console.log(`App chay thanh cong tren port ${PORT}`);
});
