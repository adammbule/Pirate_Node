const movie_id = '122906';


const url = `https://api.themoviedb.org/3/movie/${movie_id}/images`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWIyMjM2YWY4ZTc2NjBmMDgwYjFkMjNiNmNlZDY4YiIsIm5iZiI6MTczMTM0ODA0MC42MDQxMDg4LCJzdWIiOiI2NWFlOWM0NzNlMmVjODAwZWJmMDA3YTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.qOPjDtTzdcKUiF8JgEes2m9oqxr8Rh8J53xcb0tToqk'
  }
};

fetch(url, options)
  .then(response => {

    if (!response.ok) {
      throw new Error(`HTTP error! ststus: ${response.status}`);
    }
    return response.json();
  })
  .then(json => console.log(json))
  .catch(err => console.error(err));