const fetch = require("node-fetch");

const url =
  "https://www.googleapis.com/customsearch/v1?q=wwe&cx=c01f61cf2f7f14558&key=AIzaSyCQ31vt5n2IjB1XztwoRDAhqi3UJx1EQXs&searchType=image";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const firstItem = data.items && data.items[0];
    const imageUrl = firstItem ? firstItem.link : null;
    console.log(imageUrl);
  })
  .catch((error) => {
    console.error("Error fetching image:", error);
  });
