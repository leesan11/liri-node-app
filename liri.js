require("dotenv").config();
var keys=require("./keys");
var fs=require("fs");
var request=require("request");
var Spotify = require("node-spotify-api");
var spotifyApi = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

function getTweets(){
client.get('statuses/home_timeline',{count:4}, function(error, tweets, response) {
   for(i=0;i<4;i++){
    console.log(tweets[i].created_at+" : "+tweets[i].text);
   }
   if(error){
       console.log(error);
   }
   write("my-tweets()\n")
 });
};
function getSong(song){
  spotifyApi.search({ type: 'track', query: song?song:'All the Small Things', limit:1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  
  console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
  console.log("Link preview: "+data.tracks.items[0].external_urls.spotify); 
  console.log("Album: "+data.tracks.items[0].album.name);
  write("spotify-this-song()\n");
});
};

function getMovie(movie){
  let query;
  movie?query=movie:query="Mr.+Nobody";
  request("http://www.omdbapi.com/?t="+"Mr.+Nobody"+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

  if (!error && response.statusCode === 200) {
    let find=(str)=>{console.log(str+": "+JSON.parse(body)[str])}
    let arr=["Title","Year","imdbRating","Country","Language","Actors"];
    for(items of arr){find(items)};
    console.log(JSON.parse(body).Ratings[1].Source +": "+JSON.parse(body).Ratings[1].Value);
  }
  if(error){
    console.log(error);
  }
  write("movie-this()\n");
});
};
function readText(){
  fs.readFile(process.argv[3],"utf8",function(error,data){
    let arr=data.split(",");
    switch (arr[0]){
      case 'my-tweets': 
          getTweets();
          break;
      case 'spotify-this-song':
          getSong(arr[1]);
          break;
      case 'movie-this':
          getMovie(arr[1]);
          break;
      default:
        break;
    }

  })
}

function write(str){
  fs.appendFile("log.txt", str, function(err) {

    // If an error was experienced we say it.
    if (err) {
      console.log(err);
    }
  
    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("Content Added!");
    }
  
  });
}

switch (process.argv[2]){
    case 'my-tweets': 
        getTweets();
        break;
    case 'spotify-this-song':
        getSong(process.argv[3]);
        break;
    case 'movie-this':
        getMovie(process.argv[3]);
        break;
    case 'do-what-it-says':
        readText();
        break;
    default:
    break;

};
