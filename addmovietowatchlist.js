import { username, Bearer, tmurl } from './config.js';
const url = 'https://api.themoviedb.org/3/list/12345/add_item?session_id=12345';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`,},
  body: JSON.stringify({media_id: 18})
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));