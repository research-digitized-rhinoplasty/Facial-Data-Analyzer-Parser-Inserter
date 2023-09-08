/* Node server for connecting to MySQL database and parsing JSON data to MySQL commands */
const express = require('express')
var cors = require('cors')

var mySqlFn = require('./nodeMySqlFn.js')

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 25471856

async function dbDriver(jsonObj) { // driver code
  // return JSON object for returning insertion status
  var returnJson = {}
  // determine whether request is for participant or landmark&measurement insertion
  if(jsonObj.jsonType=="participant") {
    // return status for participant, participant_landmark, and participant_measurement record insertion
    returnJson["InsPartStatus"] = await mySqlFn.insParts(jsonObj)
    let partId = await mySqlFn.getPartId()
    returnJson["InsPartLndMrkStatus"] = await mySqlFn.insPartLndMrks(jsonObj.ParticipantLandmarks, partId)
    returnJson["InsPartMeasmntStatus"] = await mySqlFn.insPartMeasmnts(jsonObj.ParticipantMeasurements, partId)
  } else if(jsonObj.jsonType=="landmark_measurement") {
    // return status for landmark and measurement record insertion
    returnJson["InsLndMrkStatus"] = await mySqlFn.insLndMrks(jsonObj.Landmarks)
    returnJson["InsMeasmntStatus"] = await mySqlFn.insMeasmnts(jsonObj.Measurements)
  } else {
    return req.body
  } // end if else

  return returnJson
} // end dbDriver

app.post('/', async (req, res) => { // listen for POST requests
	res.setHeader('content-type', 'application/json') // 51000009, 51661744

  await dbDriver(req.body).then((returnJson) => {
    res.send(returnJson)
  }).catch((err) => {
    console.error(err)
  })
  
  // res.send(returnJson) // 44692048
}) // end post

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) // end listen