import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state= {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
   }

   updatePlaylistName = name => {
     this.setState({playlistName: name});
   }

   savePlaylist = () => {
     const trackURIs = [];
     this.state.playlistTracks.map(track => {
       return trackURIs.push(track.uri);
     });
     Spotify.save(this.state.playlistName, trackURIs);
     this.setState({
       playlistName: 'New Playlist',
       playlistTracks: []
     });
   }

   removeTrack = track =>{
     //how do I use the track.id to filter it out, as instructed?
     const array = this.state.playlistTracks;
     const index = array.indexOf(track);
     array.splice(index, 1);
     this.setState({playlistTracks: array });
   }

   addTrack = track => {
     if (this.state.playlistTracks.find(savedTrack =>{
      return savedTrack.id === track.id
     })){
      return;
    } else {
      this.setState({ playlistTracks: [...this.state.playlistTracks, track]})
    }
   }

   search = (searchTerm) => {
     Spotify.search(searchTerm).then(searchResults => {
       this.setState({searchResults: searchResults});
     })
   }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
