import { Bearer, tmurl } from './config.js';
const url = `${tmurl}/3/movie/122906/lists?language=en-US&page=1``;
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