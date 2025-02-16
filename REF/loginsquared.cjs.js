import { tmuse, tmpas, Bearer, tmurl, finaltoken } from './config.js';
import express from'express';
import dotenv from 'dotenv';

require('dotenv').config();

const tmurl3 = process.env.tmurl2;

console.log(apiKey);

const url = `${tmurl}/3/authentication/token/validate_with_login`;
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `${Bearer}`,
  },
  body: JSON.stringify({
    username: `${tmuse}`,
    password: `${tmpas}`,
    request_token: `${finaltoken}`,
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));