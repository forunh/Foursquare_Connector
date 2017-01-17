import cron from 'cron'
import { db } from '../db'
import * as FoursquareService from '../service/FoursquareService'

const cronJob = cron.CronJob

const venueIDs =["4df8d001814dd2985fdd35d8",
"4bf774814a67c9288ec623cf",
"4bb9a4a198c7ef3b61373202",
"4af833a6f964a5205a0b22e3",
"4c034d0cf56c2d7fa6c71c66",
"4b506953f964a520832227e3",
"4b0587fcf964a52002ab22e3",
"4b0587fdf964a5201dab22e3",
"4b8a56c2f964a520226932e3",
"4b0587fdf964a52034ab22e3"]


function saveFQvenue (venueID){
  
      FoursquareService.VenueDetail(venueID).then(page => {
        const res = JSON.parse(page) 
        if(res.meta.code == 200)    
        {         
            db.FQ_VENUE.update({id : venueID},res.response.venue,
                { upsert:true}, err => {
                if(err) {
                    console.log(err)
                }
            })
        }
      })
  
}

function saveFQtip (venueID){
    FoursquareService.venueTips(venueID).then(res => {
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
    FoursquareService.VenuePhoto(venueID).then(res => {
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
    FoursquareService.VenueHereNow(venueID).then(res => {
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
                // console.log(checkin)
            })
        }   
    })
}

function saveFQpopularHour (venueID){
    FoursquareService.VenueHours(venueID).then(res => {
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

const cronSave5min = new cronJob('*/5 * * * *', () => {
  venueIDs.forEach(venueID => {
    // saveFQtip(venueID)
    // saveFQphoto(venueID)
    saveFQcheckin(venueID)
//    console.log(" ="+db.FQ_CHECKIN.find({venueId: "4c034d0cf56c2d7fa6c71c66"}).limit(1).size())
    
    // saveFQpopularHour(venueID)
  })

                console.log("DB checkin"+new Date().toString())
  
},
() => {
  console.log('cronSaveFBcomment')
},
true
)

const cronSave30min = new cronJob('*/30 * * * *', () => {
  venueIDs.forEach(venueID => {
    saveFQtip(venueID)
    saveFQphoto(venueID)
  })
    console.log("DB tip photo "+new Date().toString())
  
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
    console.log("DB venue popular "+new Date().toString())
  
},
() => {
  console.log('cronSaveFBcomment')
},
true
)

