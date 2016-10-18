"use strict"
import express from 'express'
import bodyParser from 'body-parser'
import foursquareRouter from './controller/FoursquareController'
import cors from 'cors'
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

app.use('/foursquare', foursquareRouter)

//service start
app.listen(port, () => {
  console.log('Starting node.js on port ' + port)
});
