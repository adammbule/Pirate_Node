import { username, Bearer, tmurl } from './config.js';
const url = `${tmurl}/3/list?session_id=12345``;
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`,},
  body: JSON.stringify({
    name: 'Watchlist.',
    description: 'A list os movies/shows I intend to watch.',
    language: 'en'
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));