var mysql = require('mysql')

const con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "rhinodb"
}) // end con

module.exports = {

    dbQuery: async function dbQuery(sql, callType="noReturn") { // query database
        return new Promise((resolve, reject) => {
            con.query(sql, (err, result) => {
                if(err) reject(err)
                if(callType=="return") {
                    // if result is desired, resolve returned result object
                    resolve(JSON.parse(JSON.stringify(result)))
                } else {
                    resolve(true)
                } // end if callType
            }) // end query
        }) // end Promise
    }, // end dbQuery

    insParts: async function insParts(jsonObj) { // insert participant records
        let returnFlag = true
        // check if participant elements are null
        jsonObj.Age =               this.checkIfNull(jsonObj.Age)
        jsonObj.Ethnicity =         this.checkIfNull(jsonObj.Ethnicity)
        jsonObj.FacialSurgery =     this.checkIfNull(jsonObj.FacialSurgery)
        jsonObj.Gender =            this.checkIfNull(jsonObj.Gender)
        jsonObj.participantFileId = this.checkIfNull(jsonObj.participantFileId)
        // compile participant insertion SQL statement
        let sql = "INSERT INTO participant " +
            "(Age, Ethnicity, FacialSurgery, Gender, Participant_FileId) VALUES " +
            "(" + jsonObj.Age + ", " + jsonObj.Ethnicity + ", "
            + jsonObj.FacialSurgery + ", " + jsonObj.Gender + ", "
            + jsonObj.participantFileId + ");"

        await this.dbQuery(sql).catch(async (err) => {
            // if error, log error and delete last insertion
            console.error(err.sqlMessage)
            console.error(err.sql)
            await this.delLastIns(partId)
            // flag for returnJson to front-end
            returnFlag = false
        }) // end catch

        return returnFlag
    }, // end prepPartsSql

    insPartLndMrks: async function insPartLndMrks(lndMrkJson, partId) { // insert participant landmark records
        var sql = ""
        let errFlag = false
        let returnFlag = true
        let missingLndMrks = []
        // iterate through all landmarks and compile sql to insert
        for(var key in lndMrkJson) {
            if(lndMrkJson.hasOwnProperty(key)) {
                sql = "INSERT INTO participant_landmark " +
                    "(ParticipantID, LandmarkAbbrv, xVal, yVal, zVal) " +
                    "VALUES ('" + partId + "', '"
                    + lndMrkJson[key].LandmarkID + "', '"
                    + lndMrkJson[key].xVal + "', '"
                    + lndMrkJson[key].yVal + "', '"
                    + lndMrkJson[key].zVal + "');"
                
                await this.dbQuery(sql).catch(async (err) => {
                    // if error, log error
                    console.error(err.sqlMessage)
                    console.error(err.sql)
                    // compile missing landmarks
                    missingLndMrks.push(lndMrkJson[key].LandmarkName)
                    errFlag = true
                    // flag for returnJson to front-end
                    returnFlag = false
                }) // end catch
            } // end if hasOwnProperty
        } // end for lndMrkJson

        if(errFlag) {
            // delete last insertion and return missing landmark JSON
            await this.delLastIns(partId)
            return missingLndMrks
        } // end errFlag
        return returnFlag
      }, // end prepPartLndMrks

    insPartMeasmnts: async function insPartMeasmnts(partMeasJson, partId) { // insert participant measurement records
        var sql = ""
        let errFlag = false
        let returnFlag = true
        let missingMeasmntsJson = {}
        missingMeasmntsJson["name"] = []
        missingMeasmntsJson["type"] = []
        // iterate through all measurements and compile sql
        for(var key in partMeasJson) {
            sql = "INSERT INTO participant_measurement " +
                "(ParticipantID, MeasurementAbbrv, Type, Value) "+
                "VALUES ('" + partId + "', '"
                + partMeasJson[key].MeasurementID + "', '"
                + partMeasJson[key].MeasurementType + "', '"
                + partMeasJson[key].Value + "');"

            await this.dbQuery(sql).catch(async (err) => {
                // if error, log error
                console.error(err.sqlMessage)
                console.error(err.sql)
                // compile missing mesaurements
                missingMeasmntsJson["name"].push(partMeasJson[key].MeasurementName)
                missingMeasmntsJson["type"].push(partMeasJson[key].MeasurementType)
                errFlag = true
                // flag for returnJson to front-end
                returnFlag = false
            }) // end catch
        } // end for partMeasJson

        if(errFlag) {
            // delete last insertion
            await this.delLastIns(partId)
            return missingMeasmntsJson
        } // end if errFlag
        return returnFlag
    }, // end insMeasurements

    insMeasmnts: async function insMeasmnts(measJson) { // insert measurement records
        var sql = ""
        var landmarkInsList = ""
        var landmarkAmtList = ""
        let returnFlag = true
        // iterate through all measurements
        for(var i=0; i<measJson.MeasurementAbbrv.length; i++){
            landmarkAmtList = "" // string for insert statement column headers
            landmarkInsList = "" // string for insert statement values (landmarks themselves)
            for(var j=0; j<measJson.Landmarks[i].length; j++){
              var temp = measJson.Landmarks[i][j]
              landmarkInsList += "'" + temp + "'"
              landmarkAmtList += "LandmarkID_" + (j+1)
              // if last element, do not add comma & space after it
              if(j==measJson.Landmarks[i].length-1) continue
              landmarkInsList += ", "
              landmarkAmtList += ", "
            } // end for
            // compile sql statement
            sql = "INSERT IGNORE INTO Measurement" +
                " (MeasurementAbbrv, Name, Type, Metric, " + landmarkAmtList + ")" +
                " VALUES ('" +
                measJson.MeasurementAbbrv[i] + "', '" +
                measJson.Name[i] + "', '" +
                measJson.Type[i] + "', 'mm', " +
                landmarkInsList + ")"
        
            await this.dbQuery(sql).catch(async (err) => {
                // if error, log error
                console.error(err.sqlMessage)
                console.error(err.sql)
                console.error(measJson.Name[i] + "\n")
                // flag for returnJson for front-end
                returnFlag = false
            }) // end dbQuery
          } // end for
          return returnFlag
    }, // end insMeasmnts

    insLndMrks: async function insLndMrks(lndMrkJson) { // insert landmark records
        var sql = ""
        let returnFlag = true
        for(var i=0; i<lndMrkJson.landmarkAbbrv.length; i++){
            // Insert landmark values
            sql = "INSERT IGNORE INTO Landmark" +
                " (landmarkAbbrv, ID_Name, Name) " +
                "VALUES ('" +
                lndMrkJson.landmarkAbbrv[i] + "', '" +
                lndMrkJson.landmarkID_Name[i] +"', '" +
                lndMrkJson.landmarkName[i] + "')"
        
            await this.dbQuery(sql).catch(async (err) => {
                // if error, log error
                console.error(err.sqlMessage)
                console.error(err.sql)
                console.error(lndMrkJson.Name[i] + "\n")
                returnFlag = false
            }) // end dbQuery
        } // end for

        return returnFlag
    }, // end insLndMrks

    delLastIns: async function delLastIns(partId) { // code for deleting the last insertion (by participant Id)
        let sql = "DELETE FROM participant_landmark "
            + "WHERE ParticipantID=" + partId
        await this.dbQuery(sql)

        sql = "DELETE FROM participant_measurement "
        + "WHERE ParticipantID=" + partId
        await this.dbQuery(sql)

        sql = "DELETE FROM participant "
        + "WHERE ParticipantID=" + partId
        await this.dbQuery(sql)
    }, // end delLastIns

    getPartId: async function getPartId() { // get participant Id
        let sql = 
            "SELECT ParticipantID " +
            "FROM participant " +
            "ORDER BY ParticipantID " +
            "DESC LIMIT 1;"

        let partId = await this.dbQuery(sql, "return")
        return partId[0].ParticipantID
    }, // end getPartId
    
    checkIfNull: function checkIfNull(obj) { // check if null
        if(obj=="null") {
            return obj
        } else {
            // enclose in quotes for SQL statement
            return obj = "'" + obj + "'"
        }// end if
    },  // end checkIfNull
    
} // end module.exports