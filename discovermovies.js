const page = 40;  // For pagination, set the page number you want
const sort_by = 'popularity.desc';  // Sort options like 'popularity.desc', 'release_date.desc', etc.

const url = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${page}&sort_by=${sort_by}`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDk4ZDA0NzU0NjI5MDNlODRmMGZmNjAxYjQwZjRhNCIsIm5iZiI6MTczMTc1MzM5NC41MzE2OTksInN1YiI6IjY1YWU5YzQ3M2UyZWM4MDBlYmYwMDdhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ifwkXaTzhpzchKGkClk49qktc7qlj84cD7SdC43PEBY'
    }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
