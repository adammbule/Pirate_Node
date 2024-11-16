const url = 'https://api.themoviedb.org/3/authentication/session';
const options = {
  method: 'DELETE',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'Bearer 91b2236af8e7660f080b1d23b6ced68b'
  },
  body: JSON.stringify({session_id: '2629f70fb498edc263a0adb99118ac41f0053e8c'})
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));