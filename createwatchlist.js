const url = 'https://api.themoviedb.org/3/list?session_id=12345';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDk4ZDA0NzU0NjI5MDNlODRmMGZmNjAxYjQwZjRhNCIsIm5iZiI6MTczMTc1MzM5NC41MzE2OTksInN1YiI6IjY1YWU5YzQ3M2UyZWM4MDBlYmYwMDdhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ifwkXaTzhpzchKGkClk49qktc7qlj84cD7SdC43PEBY'
  },
  body: JSON.stringify({
    name: 'Watchlist.',
    description: 'A list os movies/shows I intend to watch.',
    language: 'en'
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));