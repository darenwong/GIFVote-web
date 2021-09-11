import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

const fetchGifs = () =>
  giphyFetch.search("who is the best member of EXO?", {
    offset: 0,
    limit: 10,
  });

console.log(fetchGifs);