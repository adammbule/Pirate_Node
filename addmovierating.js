const url = 'https://api.themoviedb.org/3/movie/912649/rating';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDk4ZDA0NzU0NjI5MDNlODRmMGZmNjAxYjQwZjRhNCIsIm5iZiI6MTczMTc1MzM5NC41MzE2OTksInN1YiI6IjY1YWU5YzQ3M2UyZWM4MDBlYmYwMDdhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ifwkXaTzhpzchKGkClk49qktc7qlj84cD7SdC43PEBY'
  },
  body: '{"value":8.5}'
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));