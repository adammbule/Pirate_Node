import { Bearer, tmurl } from './config.js';

// Function to get series details based on the series ID
function getSeriesDetails(seriesid) {
  const url = `${tmurl}/3/tv/${seriesid}?language=en-US`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${Bearer}`,
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
}

// Example usage:
const seriesid = '66732'; // This can be replaced with any dynamic input
getSeriesDetails(seriesid);
