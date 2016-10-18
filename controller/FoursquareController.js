"use strict";
import express from 'express'
import * as FoursquareService from '../service/FoursquareService'

let foursquareRouter = express.Router()


foursquareRouter.route('/').get((req, res) => {
  res.send('<h1>Foursquare Api</h1>')
})

foursquareRouter.route('/searchVenues').get((req, res) => {

    FoursquareService.searchVenues(req.query.geolocation).then( out => {
      res.send(JSON.parse(out))
      
    })
})
foursquareRouter.route('/herenow').get((req, res) => {

    FoursquareService.VenueHereNow(req.query.venue_id).then( out => {
      res.send(JSON.parse(out))
      
    })
})
foursquareRouter.route('/nextVenue').get((req, res) => {

    FoursquareService.nextVenue(req.query.venue_id).then( out => {
      res.send(JSON.parse(out))
      
    })
})
foursquareRouter.route('/venueTips').get((req, res) => {

    FoursquareService.venueTips(req.query.venue_id).then( out => {
      res.send(JSON.parse(out))
      
    })
})
foursquareRouter.route('/venueHours').get((req, res) => {

    FoursquareService.VenueHours(req.query.venue_id).then( out => {
      res.send(JSON.parse(out))
      
    })
})
foursquareRouter.route('/trendingVenue').get((req, res) => {

    FoursquareService.TrendingVenue(req.query.geolocation).then( out => {
      res.send(JSON.parse(out))
      
    })
})

export default foursquareRouter