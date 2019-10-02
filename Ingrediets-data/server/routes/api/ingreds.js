const AWS = require('aws-sdk');
var fs = require('fs');
const config = require('../../../config/config.js');
require('../../StringUtils.js');
const databaseFile = require('../../database.json');
const insert = require('../../datainsert.js');
const isDev = process.env.NODE_ENV !== 'production';
var docClient = new AWS.DynamoDB.DocumentClient();
module.exports = (app) => {
  // Gets all ingreds
  app.get('/ingredients', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name
    };
    docClient.scan(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded ingreds',
          ingreds: Items
        });
      }
    });
  }); // end of app.get(/api/ingreds)
  // Get a single ingred by id
  app.get('/ingredient/:key', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const myparam = req.params.key;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      KeyConditionExpression: '#mytext = :i',
      ExpressionAttributeValues: {
        ':i': myparam
      },
      ExpressionAttributeNames: {
        "#mytext": "text"
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
        console.log(err);
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded ingreds',
          ingreds: Items
        });
      }
    });
  });
  // Add a ingred
  app.post('/add-ingredients', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const mydata = req.body;
    let error_flag = false;
    mydata.forEach(function (item){
        // Not actually unique and can create problems.
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
          TableName: config.aws_table_name,
          Item: {
            text: item.text,
            tags: item.tags
          }
        };
        docClient.put(params, function(err, data) {
          if (err) {
            error_flag = true;
            console.log(err);
          } else {
            error_flag = false;
            console.log('data', data);
          }
        });
      });
      if(error_flag){
        res.send({
              success: false,
              message: 'Error: Server error'
            });
      } else {
      res.send({
              success: true,
              message: 'Added ingred'
            });
    }
  });

  app.post('/fuzzy-search', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const mykey = req.body.key;
    const myparam = mykey.toHashKey();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      KeyConditionExpression: '#mytext = :i',
      ExpressionAttributeValues: {
        ':i': myparam
      },
      ExpressionAttributeNames: {
        "#mytext": "text"
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
        console.log(err);
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded ingreds',
          ingreds: Items
        });
      }
    });
  });
  app.post('/insert-all', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }

    var allMovies = JSON.parse(fs.readFileSync("E:\\MERN-boilerplate-master\\MERN-boilerplate-master\\server\\database.json", 'utf8'));

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
    
        res.send({
          success: true,
          message: 'Loaded ingreds'
        });
});
}