import { getAllMovie, getLinkMovie, insertMany } from "./server.js";

const app = new Vue({
  el: "#app",
  data: {
    txtText: "",
    isSearching: false,
    listMovie: [
      {
        title: "",
        titleEnglish: "",
        daodien: "",
        listactors: [],
        listCategories: [],
        noidung: [],
        listChaps: [],
      },
    ],
    listCheck: [],
    index: 0,
    current: -1,
    show: false,
    error: "",
    serve: 0,
  },
  methods: {
    search: function () {
      if (this.txtText !== "") {
        this.isSearching = true;
        this.show = true;
        this.listCheck = [];
        getAllMovie(this.txtText)
          .then((res) => {
            console.log(res.data.listMovie[0].listChaps);
            this.listMovie = res.data.listMovie;
            for (let i = 0; i < res.data.listMovie.length; i++) {
              this.listCheck.push(0);
            }
          })
          .catch((err) => {
            console.log("err", err);
            this.show = false;
            this.err =
              "Không thể lấy dữ liệu!!! Vui lòng kiểm tra lại đường link";
          })
          .finally(() => {
            this.isSearching = false;
          });
      }
    },
    locLinkmovie: function () {
      this.listMovie.forEach(async (element, ind) => {
        this.listCheck[ind] = 2;
        let chek = true;
        for (let i = 0; i < element.listChaps.length; i++) {
          const e = element.listChaps[i];

          let a = await getLinkMovie(e.link);
          console.log(a, e.link);
          if (
            a.data.result != "" &&
            a.data.result != null &&
            a.data.result != undefined
          ) {
            e.link = await a.data.result;
          } else {
            chek = false;
          }

          //   console.log(e.link, element.title);
        }
        this.listCheck[ind] = chek ? 1 : 0;
      });
    },
    getInfoMovie: function (i) {
      this.index = i;
    },
    insertAll: function () {
      if (this.listMovie.length > 0) {
        insertMany(this.listMovie)
          .then(() => {
            this.listMovie = [];
            this.txtText = "";
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    reloadLink: async function () {
      console.log(this.current);
      let idcurrent = this.current;
      let serverid = this.serve;
      let element = this.listMovie[idcurrent];
      this.listCheck[idcurrent] = 2;
      let chek = true;
      for (let i = 0; i < element.listChaps.length; i++) {
        const e = element.listChaps[i];

        let a = await getLinkMovie(e.link, serverid);
        console.log(a, e.link);
        if (
          a.data.result != "" &&
          a.data.result != null &&
          a.data.result != undefined
        ) {
          e.link = await a.data.result;
        } else {
          chek = false;
        }

        //   console.log(e.link, element.title);
      }
      this.listCheck[idcurrent] = chek ? 1 : 0;
    },
    choceServe: function (ind) {
      this.current = ind;
    },
  },
});
