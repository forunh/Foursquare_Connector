import request from 'request'
import cron from 'cron'
import { db } from '../db'

// let params ={
//             // ll:'40.7,-74',
//             client_id : 'VYPDJ2Z5QROWDVGISDDRSS2MWQTARTSUU0LKLK3BONI03W35',
//             client_secret : 'TSJ5KW4EQYLGA5MKDKKAXFFJQJ5KGCUUCN3H3DWUJBTYJ4CQ',
//             v : today()
            
// }
let params ={
            // ll:'40.7,-74',
            client_id : '2ANDJSV5P2FT3GNVOQNSDQQSPJ5XRNO5XQR2COKWNG0I1K5C',
            client_secret : 'NXTDWJVI4RNEKJIBAUIQBKCHL1IWYIJST1YOKOJOYFWNY4KT',
            v : today()
            
}
const cronJob = cron.CronJob
// const venueIDs = ['4c034d0cf56c2d7fa6c71c66']
const venueIDs = ['4c034d0cf56c2d7fa6c71c66','4af833a6f964a5205a0b22e3','4b0587fdf964a52034ab22e3']
//kmitl airport siamparagon 
export function searchVenues(geolocation){
    params.ll = geolocation
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/search', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }

            resolve(body)
        })
    })
}
export function VenueDetail(venue_id){
    return new Promise((resolve) => {
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id, qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
            resolve(body)
        })
    })
}
export function VenuePhoto(venue_id){
    params.limit=200
    params.group='venue'
    return new Promise((resolve) => {
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/photos', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
            resolve(body)
        })
    })
}
export function VenueHereNow(venue_id){
    
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/herenow', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        
            resolve(body)
        })
    })
}

export function nextVenue(venue_id){
    
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/nextvenues', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        
            resolve(body)
        })
    })
}

export function venueTips(venue_id){
    
    params.sort = "recent"
    params.limit = 500
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/tips', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        const x = JSON.parse(body)
            
            console.log(x.response.tips.items.length)
        
            resolve(body)
        })
    })
}

export function TrendingVenue(geolocation){
    
    params.ll = geolocation
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/trending', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        
            resolve(body)
        })
    })
}

export function VenueHours(venue_id){
    
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/hours', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        
            resolve(body)
        })
    })
}
function today(){
    let month = new Date().getMonth()+1
    let date = new Date().getDate()
    let today = new Date().getFullYear().toString()
    if(month < 10)
        today = today + '0' + month.toString()
    else
        today = today + month.toString()     

    if(date < 10)
        today = today + '0' + date.toString()
    else
        today = today + date.toString()
    return today
}

function saveFQvenue (venueID){
  
      VenueDetail(venueID).then(page => {
        const res = JSON.parse(page) 
        if(res.meta.code == 200)    
        {         
            db.FQ_VENUE.update({venueId : venueID},res.response.venue,
                { upsert:true}, err => {
            if(err) {
                console.log(err)
            }
            })
        }
      })
  
}

function saveFQtip (venueID){
    venueTips(venueID).then(res => {
        const x = JSON.parse(res)
        if(x.meta.code == 200)    
        {
            
            x.response.tips.items.forEach(tip => {
                db.FQ_TIP.findOne({id : tip.id},(err,document) => {
                    if(!document){
                        tip.venueId = venueID
                        db.FQ_TIP.insert(tip, err => {
                            if(err){
                                console.log(err)
                            }
                        })
                    }
                })
            })
        }
    })
}

function saveFQphoto (venueID){
    VenuePhoto(venueID).then(res => {
        const x = JSON.parse(res)        
        if(x.meta.code == 200)    
        {
            // console.log(x.response.photos.items.length)
            x.response.photos.items.forEach(photo => {
                db.FQ_PHOTO.findOne({id : photo.id},(err,document) => {
                    if(!document){

                        photo.venueId = venueID
                        db.FQ_PHOTO.insert(photo, err => {
                            if(err){
                                console.log(err)
                            }
                        })
                    }
                })
            })
        }
    })
}

function saveFQcheckin (venueID){
    VenueHereNow(venueID).then(res => {
        const x = JSON.parse(res)   
        if(x.meta.code == 200)    
        {
            const checkin = x.response.hereNow
            checkin.venueId = venueID
            checkin.datetime = new Date().toString()
            db.FQ_CHECKIN.insert(checkin, err => {
                if(err){
                    console.log(err)
                }
            })
        }   
    })
}

function saveFQpopularHour (venueID){
    VenueHours(venueID).then(res => {
        const x = JSON.parse(res)    
        if(x.meta.code == 200)    
        {    
            // console.log(x.meta)
            const hours = x.response.popular
            hours.venueId = venueID
            hours.lastUpdated = new Date().toString()
            db.FQ_POPULARHOUR.update({venueId : venueID},hours,
                { upsert:true },(err,document) => {
                // if(!document){  
                    // db.FQ_POPULARHOUR.insert(checkin, err => {
                        if(err){
                            console.log(err)
                        }
                    // })
                // }
            })
        }
    })
}

const cronSave1min = new cronJob('00 * * * * *', () => {
  venueIDs.forEach(venueID => {
    saveFQtip(venueID)
    saveFQphoto(venueID)
    saveFQcheckin(venueID)
    // saveFQpopularHour(venueID)
  })
    console.log(new Date().toString())
  
},
() => {
  console.log('cronSaveFBcomment')
},
true
)

const cronSave1hr = new cronJob('00 00 24 * * *', () => {
  venueIDs.forEach(venueID => {
    saveFQpopularHour(venueID)
    saveFQvenue(venueID)
    
  })
    console.log(new Date().toString())
  
},
() => {
  console.log('cronSaveFBcomment')
},
true
)

