import mongojs from 'mongojs'

let databaseUrl = 'SocialData'
let collections = ['FQ_VENUE', 'FQ_POPULARHOUR', 'FQ_CHECKIN','FQ_TIP','FQ_USER','FQ_PHOTO']

export const db = mongojs(databaseUrl, collections)
