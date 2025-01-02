import { Bearer, tmurl } from './config.js';
const url = `${tmurl}/3/tv/218145/videos?language=en-US``;
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