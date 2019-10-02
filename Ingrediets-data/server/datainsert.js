var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing ingredients into DynamoDB. Please wait.");
function insertData(){
var allMovies = JSON.parse(fs.readFileSync('database.json', 'utf8'));

for (x in allMovies) {
    var params = {
        TableName: "Ing5",
        Item: {
            'text': allMovies[x].text,
            'tags': allMovies[x].tags
        }

    };
    
    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:");
       }
    });
  }
}

// allMovies.forEach(function(movie) {
//     var params = {
//         TableName: "Ing5",
//         Item: {
//             "text": movie.text,
//             "tags":  movie.tags
//         }
//     };

//     docClient.put(params, function(err, data) {
//        if (err) {
//            console.error("Unable to add movie", ". Error JSON:", JSON.stringify(err, null, 2));
//        } else {
//            console.log("PutItem succeeded:");
//        }
//     });
// });