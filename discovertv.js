import { username, Bearer, tmurl } from './config.js';
const url = `${tmurl}/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc``;
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