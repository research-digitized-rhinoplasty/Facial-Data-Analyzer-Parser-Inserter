window.addEventListener("load", () => {
    // global JSON for sending by POST request to node server
    var globalJson = {}

    // upload button event listener - when pressed send global JSON by POST request
    var submitButton = document.getElementById("partUploadButton")
    submitButton.addEventListener("click", () => {
        if(JSON.stringify(globalJson)==="{}") {
            alert("Please upload a file.")
            return
        } else {
            sendPost(JSON.parse(JSON.stringify(globalJson)))
        } // end if else
    }) // end submitButton event listener

    var uploadButton = document.getElementById("partFileToLoad")
    uploadButton.onchange = function loadJsonFile(file) { // when user uploads file
        var fileReader = new FileReader()

        fileReader.onload=function(e) {
            // parse JSON file
            modelFile = JSON.parse(e.target.result)
            // display output (unhide div)
            document.getElementById('partPreviewDiv').style.display = "flex"
            document.getElementById('partInputBox').innerHTML = JSON.stringify(modelFile, undefined, 2)

            var filenameStr = ((uploadButton.value)
                            .replace(/^.*[\\\/]/, ''))
                            .replace(/\.[^.]+$/, '')

            // get participant demographic information from page elements
            var partFeatureInput = document.querySelectorAll('#inputFeatures select')
            var genderInput = partFeatureInput[0].value
            var ethnicityInput = partFeatureInput[1].value
            var facialSurgeryInput = partFeatureInput[2].value
            var ageInput = document.querySelectorAll('input[type=number]')[0].value
            // create JSON to hold parsed JSON data
            var jsonObj = {} // 34385499
            // check if uploaded JSON has required features
            jsonObj["jsonType"] = "participant"
            jsonObj["participantFileId"] = filenameStr
            if(
                !modelFile.hasOwnProperty("gender") &&
                !modelFile.hasOwnProperty("age") &&
                !modelFile.hasOwnProperty("measurements") &&
                !modelFile.hasOwnProperty("features")
            ) {
                document.getElementById('inputBox').textContent = "Error: Wrong JSON layout."
                return
            } // end if
            // instantiate JSON object based on uploaded JSON object
            jsonObj["Gender"] = modelFile.gender
            jsonObj["Age"] = modelFile.age
            jsonObj["Ethnicity"] = ethnicityInput
            jsonObj["FacialSurgery"] = facialSurgeryInput
            jsonObj["ParticipantLandmarks"] = []
            jsonObj["ParticipantMeasurements"] = []
            
            if(jsonObj["Gender"] == "") { // if inserted gender and age do not have any values, set to null
                jsonObj["Gender"] = genderInput
            } // end if gender
            if(jsonObj["Age"] == "") {
                jsonObj["Age"] = ageInput
            } // end if age
            // iterate through JSON file participant landmarks
            for(var i=0; i<modelFile.features.length; i++){ // iterate through features in original JSON
                var valsJson = { // get feature/landmark abbreviation and x-y-z values
                    "LandmarkID":modelFile.features[i]["abbrv"],
                    "LandmarkName":modelFile.features[i]["name"],
                    "xVal":modelFile.features[i]["xVal"],
                    "yVal":modelFile.features[i]["yVal"],
                    "zVal":modelFile.features[i]["zVal"]
                }
                // push data to created JSON Landmarks
                jsonObj["ParticipantLandmarks"].push(valsJson)
            } // end features for

            // iterate through JSON file participant measurement
            for(var i=0; i<modelFile.measurements.length; i++){ // iterate through measurements in original JSON
                var valsJson = { // get measurement abbreviation and value
                    "MeasurementID":modelFile.measurements[i]["id"],
                    "MeasurementName":modelFile.measurements[i]["name"],
                    "MeasurementType":modelFile.measurements[i]["type"],
                    "Value":modelFile.measurements[i]["value"]
                }
                // push data to created JSON measurements
                jsonObj["ParticipantMeasurements"].push(valsJson)
            } // end measurements for
            
            // display created JSON in HTML
            document.getElementById('partOutputBox').textContent = JSON.stringify(jsonObj, undefined, 2)
            // update global JSON
            globalJson = jsonObj
        } // end onload
        fileReader.readAsText(this.files[0])
    } // end fileUpload
    
    function sendPost(jsonObj) { // send POST request to node server
        $.ajax({
        method: 'POST',
        url: 'http://localhost:8000',
        data: jsonObj,
        datatype: 'application/json',
        success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
            console.log(data)
            partPrintOutput(data)
        } // end success
        }) // end ajax
    } // end sendPost
})