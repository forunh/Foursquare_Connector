import request from 'request'

let params ={
            // ll:'40.7,-74',
            client_id : 'VYPDJ2Z5QROWDVGISDDRSS2MWQTARTSUU0LKLK3BONI03W35',
            client_secret : 'TSJ5KW4EQYLGA5MKDKKAXFFJQJ5KGCUUCN3H3DWUJBTYJ4CQ',
            v : today()
            
}
export function searchVenues(geolocation){
    params.ll = geolocation
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/search', qs:params},(err, response, body) => {
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
    return new Promise((resolve) => {
   
        request({url:'https://api.foursquare.com/v2/venues/'+venue_id+'/tips', qs:params},(err, response, body) => {
            if(err) { console.log(err); return; }
        
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