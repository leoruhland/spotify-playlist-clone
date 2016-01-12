angular
.module('exampleApp', ['spotify'])
.config(function (SpotifyProvider) {
    SpotifyProvider.setClientId('63f6ea16ad704784bb5da3135d1035bb');
    SpotifyProvider.setRedirectUri('http://leoruhland.github.io/spotify-playlist-clone/callback.html');
    SpotifyProvider.setScope('playlist-modify-private');
})
.controller('MainController', ['$scope', 'Spotify', function ($scope, Spotify) {

    $scope.logged = false;
    $scope.playlist = false;
    $scope.playlistSpotifyURI = '';

    $scope.fetchPlaylist = function (playlistSpotifyURI) {
        playlistSpotifyURI = playlistSpotifyURI.trim();
        if(playlistSpotifyURI!==''){
            if(playlistSpotifyURI.substring(0, 8) === 'https://'){
                playlistSpotifyURI = playlistSpotifyURI.replace('https://open.spotify.com/user/', '').replace('/playlist/', ':playlist:');
            }
            var data = playlistSpotifyURI.split(':playlist:');
            var userId = data[0].replace('spotify:user:', '');
            var playlistId = data[1];
            $scope.loading = true;
            Spotify.getPlaylist(userId, playlistId).then(function (data) {
                $scope.loading = false;
                console.log('OK', data);
                $scope.playlist = data;

            }, function(data){
                $scope.loading = false;
                $scope.playlist = false;
                console.log('ERROR!', data.error.message);
                alert(data.error.message);
            });
        }
    };

    $scope.clonePlaylist = function (playlist) {
        var userId = $scope.logged.id;
        $scope.loading = true;
        var totalTracks = playlist.tracks.items.length;
        var tracklist = [];
        for(var i=0; i<totalTracks; i++){
            var eachTrack = playlist.tracks.items[i].track.uri;
            if(eachTrack..substring(0, 13) !== 'spotify:local'){
                tracklist.push(playlist.tracks.items[i].track.uri);
            }
        }
        if(tracklist.length > 0){
            Spotify.createPlaylist(userId, {name: playlist.name, public: false}).then(function(data){
                console.log(data);
                Spotify.addPlaylistTracks(userId, data.id, tracklist).then(function(data){
                    $scope.loading = false;
                    $scope.playlist = false;
                    $scope.playlistSpotifyURI = '';
                    alert('Playlist cloned!');
                }, function(data){
                    $scope.loading = false;
                    alert(data.error.message);
                });
            }, function(data){
                alert(data.error.message);
            });
        }


    };

    $scope.login = function () {
        $scope.loading = true;

        Spotify.login().then(function (data) {
            console.log(data);
            Spotify.getCurrentUser().then(function (data) {
                console.log('getCurrentUser', data);
                $scope.logged = data;
                $scope.loading = false;
            });
        }, function () {
            $scope.logged = false;
            $scope.loading = false;
            console.log('didn\'t log in');
        })
    };

}]);
