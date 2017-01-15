import request from 'request'
import cron from 'cron'
import * as FoursquareService from '../service/FoursquareService'

let RepoAddress = "http://203.151.85.73:5002"
const cronJob = cron.CronJob

const cronSave5min = new cronJob('*/5 * * * *', () => {
    request({url:RepoAddress+'/foursquare/getAllVenue'},(err, response, body) => {
        if(err) { console.log(err); return; }
        if(response.statusCode == 200){
            let allVenue = JSON.parse(body)      
            allVenue.venues.forEach(venue => {            
                FoursquareService.VenueHereNow(venue.venueid).then(venueDetail => {
                    let res = JSON.parse(venueDetail) 
                    if(res.meta.code == 200)    
                    {
                        let checkinData = {}
                        checkinData.hereNow = res.response.hereNow
                        checkinData.venueId = venue.venueid
                        saveCheckin(checkinData)
                    }
                })
            }) 
        } 
    })
},
() => {
  console.log('cronSave5min')
},
true
)

const cronSave30min = new cronJob('*/30 * * * *', () => {
    request({url:RepoAddress+'/foursquare/getAllVenue'},(err, response, body) => {
        if(err) { console.log(err); return; }
        if(response.statusCode == 200){
            let allVenue = JSON.parse(body)      
            allVenue.venues.forEach(venue => {            
                FoursquareService.venueTips(venue.venueid).then(venueTip => {
                    let res = JSON.parse(venueTip) 
                    if(res.meta.code == 200)    
                    {
                        let tipData = {}
                        tipData.tips = res.response.tips
                        tipData.venueId = venue.venueid
                        saveTip(tipData)
                    }
                })
                FoursquareService.VenuePhoto(venue.venueid).then(venuePhoto => {
                    let res = JSON.parse(venuePhoto) 
                    if(res.meta.code == 200)    
                    {
                        let photoData = {}
                        photoData.photos = res.response.photos
                        photoData.venueId = venue.venueid
                        savePhoto(photoData)
                    }
                })
            }) 
        }        
    })
},
() => {
  console.log('cronSave30min')
},
true
)

export function saveCheckin(checkinData){
    request({
        url: RepoAddress+'/foursquare/addCheckin',
        method: "POST",
        json: checkinData
         },(error, response, body) => {
            if(error) { console.log(error.code); return; } 
            // console.log(response.statusCode)
    })
}

export function saveTip(tipData){
    request({
        url: RepoAddress+'/foursquare/addTips',
        method: "POST",
        json: tipData
         },(error, response, body) => {
            if(error) { console.log(error.code); return; } 
            // console.log(response.statusCode)
    })
}

export function savePhoto(photoData){
    request({
        url: RepoAddress+'/foursquare/addPhotos',
        method: "POST",
        json: photoData
         },(error, response, body) => {
            if(error) { console.log(error.code); return; } 
            // console.log(response.statusCode)
    })
}
