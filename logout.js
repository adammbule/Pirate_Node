import { Bearer, tmurl } from './config.js';
const url = 'https://api.themoviedb.org/3/authentication/session';
const options = {
  method: 'DELETE',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`,
  },
  body: JSON.stringify({session_id: '2629f70fb498edc263a0adb99118ac41f0053e8c'})
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));