import { username, Bearer, tmurl } from './config.js';
const page = 40;  // For pagination, set the page number you want
const sort_by = 'popularity.desc';  // Sort options like 'popularity.desc', 'release_date.desc', etc.

const url = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${page}&sort_by=${sort_by}`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `${Bearer}`,}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
