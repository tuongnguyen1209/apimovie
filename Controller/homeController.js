const rp = require("request-promise");
const cheerio = require("cheerio");
const request = require("request");

exports.getAll = (req, res) => {
  let diachi = "http://vaophim.com/";
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

      //1,list Chieu rap
      let listMovieCinema = $("#halim-advanced-widget-11-ajax-box article ");

      let ListCinema = [];
      for (let i = 0; i < 10; i++) {
        let movieCinema = $(listMovieCinema[i]);
        let linkCinema = movieCinema.find("a").attr("href").slice(18);
        let imgCinema = movieCinema.find("img").attr("data-src");
        let nameCinema = movieCinema.find(".entry-title").text().trim();
        let rankCinema = movieCinema.find(".status").text().trim();

        ListCinema.push({
          link: linkCinema,
          img: imgCinema,
          name: nameCinema,
          rank: rankCinema,
        });
      }

      // console.log(ListCinema);

      // 2 list phim hot
      let moviesHot = $("#halim-fullwith-slider-widget-2 .item");

      let ListHot = [];
      for (let i = 0; i < moviesHot.length - 1; i++) {
        let movieHot = $(moviesHot[i]);
        let linkHot = movieHot.find("a").attr("href").trim().slice(18);
        let imgHot =
          "http://vaophim.com" + movieHot.find("img").attr("data-cfsrc");
        let nameHot = movieHot.find(".slider-title").text();
        let nameEHot = movieHot.find("p").text();
        ListHot.push({
          link: linkHot,
          img: imgHot,
          name: nameHot,
          nameen: nameEHot,
        });
      }
      // console.log(ListHot);

      //3 Phim bo xem nhieu

      let moviePhimBo = $("#sidebar .tab-content")[0];
      let movieNowToWatch = $(moviePhimBo).find(".item");
      let listPhimBo = [];
      for (let i = 0; i < 10; i++) {
        let movieToDay = $(movieNowToWatch[i]);

        let linkToDay = movieToDay.find("a").attr("href").trim().slice(18);
        let imgToDay = movieToDay.find("img").attr("data-src");
        let nameToDay = movieToDay.find(".title").text();

        let nameen = movieToDay.find(".original_title").text().trim();
        let viewsToDay = movieToDay.find(".viewsCount").text().trim();
        listPhimBo.push({
          link: linkToDay,
          img: imgToDay,
          name: nameToDay,

          views: viewsToDay,
          nameen: nameen,
        });
      }
      // console.log(listPhimBo);

      //4 Phim le xem nhieu
      let moviesNew = $("#sidebar .tab-content")[1];
      let movieLe = $(moviesNew).find(".item");
      let listPhimLe = [];
      for (let i = 0; i < 10; i++) {
        let movieNew = $(movieLe[i]);

        let link = movieNew.find("a").attr("href").trim().slice(18);
        let img = movieNew.find("img").attr("data-src");
        let name = movieNew.find(".title").text();
        let nameen = movieNew.find(".original_title").text().trim();
        let views = movieNew.find(".viewsCount").text().trim();
        listPhimLe.push({
          link: link,
          img: img,
          name: name,
          nameen: nameen,
          views: views,
        });
      }
      // console.log(listPhimLe);

      let datas = {
        status: "success",
        results: 4,
        data: {
          ListHot,
          ListCinema,
          listPhimBo,
          listPhimLe,
        },
      };
      res.status(200).json(datas);
    })();
  });
};
