const localv1 = "http://localhost:7300/apis/v1/";
const localv2 = "http://localhost:7300/apis/v2/";

export const getAllMovie = async (link) => {
  let a = await fetch(`${localv1}getallmovie`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      link: link,
    }),
  });
  return await a.json();
};

export const getLinkMovie = async (link, serve = 1) => {
  let a = await fetch(`${localv1}getlinkmovie`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      link: link,
      server: serve,
    }),
  });
  return await a.json();
};

export const insertMany = async (list) => {
  let a = await fetch(`${localv2}movie`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listmovie: list,
    }),
  });
  return await a.json();
};
