import { username, Bearer, tmurl } from './config.js';
const url = 'https://api.themoviedb.org/3/movie/912649/rating';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: `${Bearer}`,},
  body: '{"value":8.5}'
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));