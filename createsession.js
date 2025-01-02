import { username, Bearer, tmurl } from './config.js';
const url = `${tmurl}/3/authentication/session/new``;
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`,}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));

