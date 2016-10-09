"use strict";
import express from 'express'
import * as FoursquareService from '../service/FoursquareService'

let foursquareRouter = express.Router()





foursquareRouter.route('/').get((req, res) => {
  res.send('<h1>Foursquare Api</h1>')
})

foursquareRouter.route('/addPage').get((req, res) => {

    FoursquareService.addPage(req.query.pageID)
    res.send("Add Page "+req.query.pageID)
   
})

export default foursquareRouter