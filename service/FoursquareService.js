import foursquare from 'node-foursquare'
import { db } from '../db'
import cron from 'cron'
import request from 'request'

let cronJob = cron.CronJob

let config = {
     'secrets' : {
            'clientId' : 'VYPDJ2Z5QROWDVGISDDRSS2MWQTARTSUU0LKLK3BONI03W35',
            'clientSecret' : 'TSJ5KW4EQYLGA5MKDKKAXFFJQJ5KGCUUCN3H3DWUJBTYJ4CQ',
            'redirectUrl' : 'REDIRECT_URL'
        }
}
let foursquare = require('node-foursquare')(config);



export function getFbDetail(userID) {
    var params = {fields: "name,picture"}    
    return new Promise((resolve) =>{
        foursquare.get('', (err, res) => {
            resolve(res)
        })
    })
     
}
