import Foursquare from 'node-foursquare'
import request from 'request'

let config = {
     'secrets' : {
            'clientId' : 'VYPDJ2Z5QROWDVGISDDRSS2MWQTARTSUU0LKLK3BONI03W35',
            'clientSecret' : 'TSJ5KW4EQYLGA5MKDKKAXFFJQJ5KGCUUCN3H3DWUJBTYJ4CQ',
        }
}
let foursquare = Foursquare(config)


export function getFbDetail(userID) {
    var params = {fields: "name,picture"}
    return new Promise((resolve) =>{
        foursquare.get('', (err, res) => {
            resolve(res)
        })
    })
}
