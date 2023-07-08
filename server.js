/* Node server for connecting to MySQL database and (further) parsing JSON data to MySQL commands */

const express = require('express')
var cors = require('cors')
var mysql = require('mysql')
const { stat } = require('fs')
const app = express()
const port = 8000

// server connection details
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "rhinodb"
}) // end con

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 25471856

function sendToDB(zaJson) { // send JSON values to DB
  // if (err) throw err
  // console.log("Connected!")

  // if any participant elements are not null (gender, ethnicity, facial surgery, age), then prepare them for insert statement
  if(zaJson.Gender!=="null") {
    zaJson.Gender = "'" + zaJson.Gender + "'"
  } // end if gender
  if(zaJson.Ethnicity!=="null") {
    zaJson.Ethnicity = "'" + zaJson.Ethnicity + "'"
  } // end if gender
  if(zaJson.FacialSurgery!=="null") {
    zaJson.FacialSurgery = "'" + zaJson.FacialSurgery + "'"
  } // end if gender
  if(zaJson.Age!=="null") {
    zaJson.Age = "'" + zaJson.Age + "'"
  } // end if gender

  // insert participant elements into database
  var sql = "INSERT INTO participant (Gender, Ethnicity, FacialSurgery, Age) VALUES (" + zaJson.Gender + ", " + zaJson.Ethnicity + ", " + zaJson.FacialSurgery + ", " + zaJson.Age + ");"
  con.query(sql, (err) => {
    if(err) throw err
  }) // end query

  // get participantID (auto-incremented) from participant table
  sql = "SELECT ParticipantID FROM participant ORDER BY ParticipantID DESC LIMIT 1;"
  con.query(sql, function(err, result){ // contained inside a query to maintain ParticipantID variable value AKA callback hell
    // prepare for inserting participant landmarks
    if (err) throw err
    // participant landmarks each have a corresponding participantID
    ParticipantID = result[0].ParticipantID
    // insert all landmarks from the JSON
    for(var i=0; i<zaJson.Landmarks.length; i++) {
      sql = "INSERT INTO participant_landmark (ParticipantID, LandmarkAbbrv, xVal, yVal, zVal) VALUES ('" + ParticipantID + "', '" + zaJson.Landmarks[i].LandmarkID + "', '" + zaJson.Landmarks[i].xVal + "', '" + zaJson.Landmarks[i].yVal + "', '" + zaJson.Landmarks[i].zVal + "');"

      con.query(sql, function(err) {
        if(err) throw err
      }) // end child query
    } // end for

    // repeat and insert all measurements
    for(var i=0; i<zaJson.Measurements.length; i++) {
      sql = "INSERT INTO participant_measurement (ParticipantID, MeasurementAbbrv, Value) VALUES ('" + ParticipantID + "', '" + zaJson.Measurements[i].MeasurementID + "', '" + zaJson.Measurements[i].Value + "');"

      con.query(sql, function(err) {
        if(err) throw err
      }) // end child query
    } // end for
  }) // end parent query

  // console.log("Successfully inserted into the database")
} // end sendToDB

var counter = 0
app.post('/', (req, res) => { // listen for POST requests
	res.setHeader('content-type', 'application/json') // 51000009, 51661744
  counter+=1  
  sendToDB(req.body)
  console.log("Successfully inserted into the database: " + counter)
  res.send(req.body) // 44692048
}) // end post

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
}) // end listen