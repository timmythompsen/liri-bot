var Keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request  = require("request");
var fs = require("fs");
var inquirer = require("inquirer");

var twit = new twitter(Keys.twitterKeys);
var spot = new spotify(Keys.spotifyKeys);

inquirer
  .prompt([
    
    {
      type: "input",
      message: "Hello. I am liri. What can I help you with today?",
      name: "liri"
    }
  ])
  .then(function(inquirerResponse) {
    if(inquirerResponse.liri === "my-tweets"){
      tweets();
    }
    else if(inquirerResponse.liri === "spotify-this-song"){
      inquirer
      .prompt([
        
        {
          type: "input",
          message: "What song are you looking for?",
          name: "song"
        }
      ])
      .then(function(response) {
     spotify(response.song);
   });

    }
    else if(inquirerResponse.liri === "movie-this"){
        inquirer
        .prompt([
          
          {
            type: "input",
            message: "What movie are you looking for?",
            name: "movie"
          }
        ])
        .then(function(result) {
          movies(result.movie);
        });
        
    }
    else if(inquirerResponse.liri === "do-what-it-says"){
      fs.readFile("random.txt","UTF-8",(err,data) => {
           console.log(data);
           var inputString = data;
           
           var prompt = inputString.split(",")[0];
          
           var input = inputString.split(",")[1];
           if(prompt === "spotify-this-song"){
              spotify(input);
           }

      });
    }
  });

function tweets(){
	twit.get('statuses/user_timeline',{user_id:"tim_thompsen",count:20},function(error,tweets,response){
   if(error){
   	console.log(error);
   	return;
   }
   for(var i=0;i < tweets.length;i++){
    console.log("***************************");
   	console.log("Tweet: " + tweets[i].text);
   	console.log("***************************");
   }

  });

}

function spotify(inputVal){
if(inputVal === undefined || inputVal === null){
	inputVal = "The Sign";
}
spot.search({type:"track",query:inputVal},function(error,data){
	if(error){
		console.log("Error Abort");
		return;
	}

    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    console.log("Song: " + data.tracks.items[0].name);
	  console.log("Preview url: "+ data.tracks.items[0].preview_url);

});

}

function movies(inputVal){

if(inputVal === undefined || inputVal === null){
    inputVal = "Mr Nobody";
  }
  var requestUrl = "http://www.omdbapi.com/?t=" + inputVal + "&y=&plot=short&apikey=" + Keys.omdbKey.apiKey; 
  request.get({url:requestUrl},function(error,response,data){
             
              data = JSON.parse(data);
             if(error){
                console.log("movie not found");
              return;
             }
             
              console.log("Year of release: " + data.Year);
              console.log("IMDB Rating: " + data.imdbRating);
              for(var i=0;i < data.Ratings.length;i++){
                if(data.Ratings[i].Source === "Rotten Tomatoes"){
                 console.log("Rotten Tomatoes Rating: " + data.Ratings[i].Value);
                }
              }
              console.log("Country of production: " + data.Country);
              console.log("Language of movie: " + data.Language);
              console.log("Plot: " + data.Plot);
              console.log("Actors: " + data.Actors);
  });

}



