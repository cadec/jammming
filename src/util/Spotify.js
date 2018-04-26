const clientId = '2960c5efbd144d0ab39a1ee8bc893ab6';
const redirectUri = 'http://localhost:3000/';
let token;
let tokenExpire;
let userId;

const Spotify = {}

Spotify.getAccessToken = () => {
  const url = window.location.href;

  if (token){
    return token;

  } else if (url.match(/access_token=([^&]*)/) && url.match(/expires_in=([^&]*)/)){
    token = url.match(/access_token=([^&]*)/)[1];
    tokenExpire = url.match(/expires_in=([^&]*)/)[1];
    window.setTimeout(() => token = '', tokenExpire * 1000);
    window.history.pushState('Access Token', null, '/');
    return token;
  } else {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
  }
}

Spotify.search = term => {
  Spotify.getAccessToken();
  return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
  headers: {Authorization: `Bearer ${token}`}
  }).then(response => {
    if (response.ok){
      return response.json();
    }
    throw new Error('Request failed!');
  }, networkError => console.log(networkError.message)).then(jsonResponse => {
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      });
    });
}

Spotify.save = (playlistName, trackURIs) => {
  Spotify.getAccessToken();
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  if (!playlistName || !trackURIs){
    return;
  } else {
    return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
      if (response.ok){
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      userId=jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
        }).then(response =>{
        return response.json();
      }).then(jsonResponse => {
        return fetch(`https://api.spotify.com/v1/users/${jsonResponse.owner.id}/playlists/${jsonResponse.id}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
        });
      });
    });



  }
}

export default Spotify;
