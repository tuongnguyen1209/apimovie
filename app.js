const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const routers = require("./Router/routers");
const DATABASE = require("./Database/DatabaseConfig");
const events = require("events");
const routerMovie = require("./Router/routerMovie");

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

// app.get("/topmovie", (req, res) => {
//   // res.send('hello')
//   let diachi = "https://phim1080z.com/bang-xep-hang";
//   request(diachi, function (error, response, body) {
//     const options = {
//       uri: diachi,
//       transform: function (body) {
//         //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
//         return cheerio.load(body);
//       },
//     };
//     (async function crawler() {
//       try {
//         // Lấy dữ liệu từ trang crawl đã được parseDOM
//         var $ = await rp(options);
//       } catch (error) {
//         return error;
//       }

//       // let logo=$('.logo').text();
//       // console.log(logo);

//       let listMovie = $(".tray-left .tray-item");
//       console.log(listMovie.length);
//       let data = [];
//       for (let i = 0; i < 5; i++) {
//         let movie = $(listMovie[i]);

//         let link = movie.find("a").attr("href").trim();
//         let img = movie.find(".tray-item-thumbnail").attr("data-src");
//         let name = movie.find(".tray-item-title").text();
//         let rank = movie.find(".tray-item-point").text().trim();
//         let views = movie.find(".tray-film-views").text().trim();
//         let time = movie.find(".tray-film-likes").text().trim();
//         data.push({
//           link,
//           img,
//           name,
//           rank,
//           views,
//           time,
//         });
//       }
//       console.log(data);
//       res.send(JSON.stringify(data));
//     })();
//     // res.send(body);
//   });
// });

// app.get("/phim", (req, res) => {
//   let link = req.query.namephim;
//   let diachi = `https://phim1080z.com/${link}`;
//   request(diachi, function (error, response, body) {
//     const options = {
//       uri: diachi,
//       transform: function (body) {
//         //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
//         return cheerio.load(body);
//       },
//     };
//     (async function crawler() {
//       try {
//         // Lấy dữ liệu từ trang crawl đã được parseDOM
//         var $ = await rp(options);
//       } catch (error) {
//         return error;
//       }

//       // let logo=$('.logo').text();
//       // console.log(logo);
//       let data = [];

//       let title = $(".film-info-title").text().trim();
//       let views = $(".film-info-views .display-sx").text().trim();
//       let info = $(".film-info-genre");

//       let quocgia = $(info[0]).find("a").text().trim();
//       let nam = $(info[1]).text().trim();
//       let chatluong = $(info[2]).text().trim();
//       let amthanh = $(info[3]).text().trim();
//       let time = $(info[4]).text().trim();
//       let tenkhac = $(info[5]).text().trim();
//       let theloaiabc = $(info[6]).find("a");
//       let theloais = [];
//       for (let i = 0; i < theloaiabc.length; i++) {
//         let a = $(theloaiabc[i]).text().trim();
//         theloais.push(a);
//       }

//       let detail = $(".film-info-description").text().trim();

//       data.push({
//         link,
//         title,
//         views,
//         quocgia,
//         nam,
//         chatluong,
//         amthanh,
//         time,
//         tenkhac,
//         theloais,
//         detail,
//       });

//       console.log(data);
//       res.send(JSON.stringify(data));
//     })();
//     // res.send(body);
//   });
// });
// app.get("/getphim", (req, res) => {
//   let link = req.query.namephim;
//   let url = `https://phim1080z.com/${link}`;

//   getLinkVideo(url).then((data) => {
//     res.send(JSON.stringify(data));
//   });
// });

// let getLinkVideo = async (url) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url);

//   // await page.click('#navigation > li:nth-child(3) > a');

//   await page.waitForSelector(".player-wrapper ");
//   await page.waitForSelector(".player-wrapper  video");
//   // await page.waitForTimeout('1000')
//   await page.waitForSelector(".player-wrapper  video[src]");
//   const Url = await page.evaluate(() => {
//     return document.querySelector(".player-wrapper video").getAttribute("src");
//   });
//   console.log(Url);
//   await browser.close();
//   return await Url;
// };

const server = app.listen(PORT, () => {
  console.log(`App chay thanh cong tren port ${PORT}`);
});
