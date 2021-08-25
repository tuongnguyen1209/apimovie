const rp = require("request-promise");
const cheerio = require("cheerio");
const request = require("request");

exports.getNav = (req, res) => {
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

      //1 category
      let navCate = $("#menu-menu-1 .dropdown .dropdown-menu")[0];

      let categorys = $(navCate).find("li ");

      let listCategory = [];
      for (let i = 0; i < categorys.length; i++) {
        let e = $(categorys[i]);
        let cate = e
          .find("a")
          .text()
          .trim()
          .replace(/[^a-zA-Z ]/g, "");
        let linkCate = e.find("a").attr("href").slice(18);

        listCategory.push({
          cate,
          link: linkCate,
        });
      }

      //2 country

      let navCountry = $("#menu-menu-1 .dropdown .dropdown-menu")[1];

      let countries = $(navCountry).find("li");

      let listContries = [];
      for (let i = 0; i < countries.length; i++) {
        let e = $(countries[i]);
        let country = e.find("a").text().trim();
        let linkCountry = e.find("a").attr("href").slice(18);

        listContries.push({
          country,
          link: linkCountry,
        });
      }

      let datas = {
        status: "success",
        results: 2,
        data: {
          listCategory,
          listContries,
        },
      };

      res.status(200).json(datas);
    })();
  });
};
