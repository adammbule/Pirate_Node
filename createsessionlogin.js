import { email, Bearer, tmurl, requesttoken } from './config.js';
const url = `${tmurl}/3/authentication/token/validate_with_login`;
//const url = 'https://api.themoviedb.org/3/authentication/token/validate_with_login';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`
  },
  body: JSON.stringify({
    username: `${email}`,
    password: `password`,
    request_token: `requesttoken`
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
console.log(`${requesttoken}`);