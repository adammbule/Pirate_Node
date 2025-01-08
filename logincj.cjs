require('dotenv').config();

const tmurl3 = process.env.tmurl2 || 'https://default-url.com'; // Fallback URL
const tmuse2 = process.env.tmuse;
const tmpas2 = process.env.tmpas;
const Bearer2 = process.env.Bearer;
const finaltoken2 = process.env.finaltoken;

console.log("tmurl3:", tmurl3); // Debugging
console.log("tmuse2:", tmuse2); // Debugging
console.log("tmpas2:", tmpas2); // Debugging
console.log("Bearer2:", Bearer2); // Debugging
console.log("finaltoken2:", finaltoken2); // Debugging

const url = `${tmurl3}/3/authentication/token/validate_with_login`;
console.log("Constructed URL:", url); // Debugging

const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer2}`,
  },
  body: JSON.stringify({
    username: `${tmuse2}`,
    password: `${tmpas2}`,
    request_token: `${finaltoken2}`,
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
