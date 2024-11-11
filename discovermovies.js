const page = 40;  // For pagination, set the page number you want
const sort_by = 'popularity.desc';  // Sort options like 'popularity.desc', 'release_date.desc', etc.

const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sort_by}`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOI5MWIyMjM2YWY4ZTc2NjBmMDgwjFkMjNiNmNZDY4YiIsIm5iZiI6MTczMTM0ODA0MC42MDQxMDg4LCJzdWIiOiI2NWFlOWM0NzNlMmVjODAwZWJmMDA3YTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.qOPjDtTzdcKUiF8JgEes2m9oqxr8Rh8J53xcb0tToqk'
    }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
