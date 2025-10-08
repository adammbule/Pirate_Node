import {GoogleAuth} from 'google-auth-library';
const targetAudience = 'https://piratenode.onrender.com/';


//const {GoogleAuth} = require('google-auth-library');

async function getIdTokenFromMetadataServer() {
  const googleAuth = new GoogleAuth();

  const client = await googleAuth.getIdTokenClient(targetAudience);

  // Get the ID token.
  // Once you've obtained the ID token, you can use it to make an authenticated call
  // to the target audience.
  await client.idTokenProvider.fetchIdToken(targetAudience);
  console.log('Generated ID token.', client);
}

getIdTokenFromMetadataServer();