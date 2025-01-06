import { email, Bearer, tmurl } from './config.js';


const url = `${tmurl}/3/authentication/token/new`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `${Bearer}`}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));