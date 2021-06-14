const rp = require("request-promise");
const cheerio = require("cheerio");
const request = require("request");
const puppeteer = require("puppeteer");

const getMovieInfo = async (link) => {
  let diachi = `http://vaophim.com/${link}`;
  let datas;
  //  request(diachi, function (error, response, body) {
  const options = {
    uri: diachi,
    transform: function (body) {
      //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
      return cheerio.load(body);
    },
  };

  async function crawler() {
    let $;
    try {
      // Lấy dữ liệu từ trang crawl đã được parseDOM
      $ = await rp(options);
    } catch (error) {
      return error;
    }

    // let data = [];
    //tieu de phim
    let title = $(".movie-detail .entry-title").text().trim();
    let titleEnglish = $(".movie-detail .org_title").text().trim();
    //nam san xuat
    let year = $(".movie-detail .released a").text().trim();
    //thoi gian
    let time = $(".movie-detail .released").text().replace(year, "").trim();

    //list quoc gia va dien vien
    let detailmovie = $(".movie-detail .actors");

    // lay quoc gia
    let countries = $(detailmovie[0]).find("a");
    let listCountries = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      let nameCountry = $(country).text();

      listCountries.push({ country: nameCountry });
    }

    //lay  dien vien
    let actors = $(detailmovie[1]).find("a");
    let listactors = [];
    for (let i = 0; i < actors.length; i++) {
      let actor = actors[i];
      let nameActors = $(actor).text();

      listactors.push({ name: nameActors });
    }

    //lay dao dien
    let directors = $(".movie-detail .directors .director").text().trim();

    //lay the loai
    let categories = $(".movie-detail .category a");
    let listCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let category = $(categories[i]);

      let nameCate = category.text().trim();

      listCategories.push({
        nameCate,
      });
    }

    //lay noi dung
    let contents = $(".video-item .item-content ")
      .text()
      .replace(/VAOPHIM/g, "PhimCuaTui");

    //lay trailer
    let trailer = $("#show-trailer").attr("data-url");

    //lay link tap

    let chaps = $("#listsv-1 li a");

    let listChaps = [];
    for (let i = 0; i < chaps.length; i++) {
      let chap = $(chaps[i]);

      let nameChap = chap.find("span").text();
      let link = chap.attr("href");
      // let link = await getLinkVideo(linkchap);
      listChaps.push({ nameChap, link });
    }

    datas = {
      title,
      titleEnglish,
      year,
      time,
      listCountries,
      listactors,
      directors,
      listCategories,
      contents,
      trailer,
      listChaps,
    };

    return datas;
  }
  // res.send(body);

  return await crawler();
};

exports.getAllMovie = (req, res) => {
  let link1 = req.body.link;
  let diachi = `${link1}`;
  console.log(req.body);
  request(diachi, function (error, response, body) {
    const options = {
      uri: diachi,
      transform: function (body) {
        //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
        return cheerio.load(body);
      },
    };
    (async function crawler() {
      try {
        // Lấy dữ liệu từ trang crawl đã được parseDOM
        var $ = await rp(options);
      } catch (error) {
        return res.status(400).json({
          status: "fail",
          error: true,
          message: error,
        });
      }

      //title
      // let title = $("#main-contents .section-title").text().trim();
      let movies = $("#main-contents .halim_box .grid-item");

      let listMovie = [];
      for (let i = 0; i < movies.length; i++) {
        const movie = $(movies[i]);
        let img = movie.find("img").attr("data-src");
        let link = movie.find("a").attr("href").slice(18);
        // let name = movie.find(".entry-title").text().trim();
        // let nameen = movie.find(".original_title").text().trim();
        let movieInfo = await getMovieInfo(link);

        console.log(movieInfo.title);
        listMovie.push({
          img,
          ...movieInfo,
        });
      }

      let datas = {
        status: "success",
        result: listMovie.length,
        error: false,
        data: {
          listMovie,
        },
      };
      // console.log(listMovie);
      // res.status(200).send(body);
      res.status(200).json(datas);
    })();
  });
};

exports.getLinkMovie = (req, res) => {
  let link = req.body.link;
  let server = req.body.server;
  let diachi = `${link}?svid=${server}`;

  getLinkVideo(diachi)
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: {
          result,
        },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "fail",
        error: true,
        mess: err,
      });
    });
};

let getLinkVideo = async (url) => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  try {
    await page.goto(url);

    // await page.waitForRequest;
    await page.waitForSelector(".jw-media", { timeout: 5000 });
    await page.waitForSelector(".jw-media video", { timeout: 5000 });
    await page.waitForSelector(
      ".jw-icon.jw-icon-display.jw-button-color.jw-reset.jw-idle-label",
      { timeout: 5000 }
    );
    await page.click(
      ".jw-icon.jw-icon-display.jw-button-color.jw-reset.jw-idle-label"
    );
    // await page.waitForSelector("#ajax-player video[src]");

    const Url = await page.evaluate(() => {
      return document
        .querySelector("video.jw-video.jw-reset")
        .getAttribute("src");
    });
    // console.log(Url);
    await browser.close();
    return await Url;
  } catch (e) {
    console.log(e);
    browser.close();
    return "";
  }
  return "";
};
