const rp = require("request-promise");
const cheerio = require("cheerio");
const request = require("request");
const puppeteer = require("puppeteer");

exports.getMovieInfo = (req, res) => {
  let link = req.params.namemovie;

  let diachi = `http://vaophim.com/${link}`;

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
        return error;
      }

      // let data = [];
      //tieu de phim
      let title = $(".movie-detail .entry-title").text().trim();
      let titleEnglish = $(".movie-detail .org_title").text().trim();
      //nam san xuat
      let year = $(".movie-detail .released").text().trim();
      //thoi gian
      let time = $(".movie-detail .hl-clock").text().trim();

      //list quoc gia va dien vien
      let detailmovie = $(".movie-detail .actors");

      // lay quoc gia
      let countries = $(detailmovie[0]).find("a");
      let listCountries = [];
      for (let i = 0; i < countries.length; i++) {
        let country = countries[i];
        let nameCountry = $(country).text();
        let link = $(country).attr("href").slice(18);

        listCountries.push({ country: nameCountry, link });
      }

      //lay  dien vien
      let actors = $(detailmovie[1]).find("a");
      let listactors = [];
      for (let i = 0; i < actors.length; i++) {
        let actor = actors[i];
        let nameActors = $(actor).text();
        let link = $(actor).attr("href").slice(18);

        listactors.push({ name: nameActors, link });
      }

      //lay dao dien
      let daodien = $(".movie-detail .directors .director").text().trim();

      //lay the loai
      let categories = $(".movie-detail .category a");
      let listCategories = [];
      for (let i = 0; i < categories.length; i++) {
        let category = $(categories[i]);

        let nameCate = category.text().trim();
        let link = category.attr("href").slice(18).trim();
        listCategories.push({
          nameCate,
          link,
        });
      }

      //lay noi dung
      let noidung = $(".video-item .item-content ")
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
        let link = chap.attr("href").slice(18);
        listChaps.push({ nameChap, link });
      }

      //lay phim lieu quan
      let phimLienQuan = $("#halim_related_movies-2 article.grid-item");

      let listRelatedMovies = [];

      for (let i = 0; i < phimLienQuan.length; i++) {
        const movie = $(phimLienQuan[i]);

        let link = movie.find("a").attr("href").slice(18);
        let img = movie.find("img ").attr("data-src");
        let name = movie.find(".entry-title").text().trim();
        let nameen = movie.find(".original_title").text().trim();
        let episode = movie.find(".episode").text().trim();
        let status = movie.find(".status").text().trim();
        listRelatedMovies.push({
          link,
          img,
          name,
          nameen,
          episode,
          status,
        });
      }
      let datas = {
        title,
        titleEnglish,
        year,
        time,
        listCountries,
        listactors,
        daodien,
        listCategories,
        noidung,
        trailer,
        listChaps,
        listRelatedMovies,
      };

      res.status(200).json({ status: "success", result: 12, data: datas });
      // res.status(200).send(body);
    })();
    // res.send(body);
  });
};

exports.getAllMovie = (req, res) => {
  let link1 = req.params.link1 || "";
  let link2 = req.params.link2 || "";

  let diachi = `http://vaophim.com/${link1}/${link2}`;
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
        return error;
      }

      //title
      let title = $("#main-contents .section-title").text().trim();
      let movies = $("#main-contents .halim_box .grid-item");

      let listMovie = [];
      for (let i = 0; i < movies.length; i++) {
        const movie = $(movies[i]);
        let img = movie.find("img").attr("data-src");
        let link = movie.find("a").attr("href").slice(18);
        let name = movie.find(".entry-title").text().trim();
        let nameen = movie.find(".original_title").text().trim();

        listMovie.push({
          link,
          img,
          name,
          nameen,
        });
      }

      let datas = {
        status: "success",
        result: listMovie.length,
        data: {
          title,
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
  let link = req.params.namemovie;
  let diachi = `http://vaophim.com/${link}/play-sv1.html?svid=1`;

  getLinkVideo(diachi).then((result) => {
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};

let getLinkVideo = async (url) => {
  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url);

    // await page.waitForRequest;
    await page.waitForSelector(".jw-media");
    await page.waitForSelector(".jw-media video");
    await page.waitForSelector(
      ".jw-icon.jw-icon-display.jw-button-color.jw-reset.jw-idle-label"
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
    return "";
  }
  return "";
};
