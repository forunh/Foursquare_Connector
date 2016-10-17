"use strict"
import express from 'express'
import bodyParser from 'body-parser'
// import twitterRouter from './controller/TwitterController'
import cors from 'cors'
// import mfq from 'node-foursquare'
// import swagger from 'swagger-node-express'
// import { applicationUrl, swaggerPath } from './swagger'

//Port
const port = process.env.port || 6003
let app = express()

//enable cors
app.use(cors())

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//parent url
app.route('/').get((req, res) => {
  res.send('<h1>Social REST Api</h1>')
})

app.get('/login', function(req, res) {
  res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
  res.end();
});


app.get('/callback', function (req, res) {
  foursquare.getAccessToken({
    code: req.query.code
  }, function (error, accessToken) {
    if(error) {
      res.send('An error was thrown: ' + error.message);
    }
    else {
      // Save the accessToken and redirect.
    }
  });
});

//service start
app.listen(port, () => {
  console.log('Starting node.js on port ' + port)
});
