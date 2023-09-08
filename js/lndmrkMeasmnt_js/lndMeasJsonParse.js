window.addEventListener("load", () => {
    // global JSON for sending by POST request to node server
    var globalJson = {}

    // upload button event listener - when pressed send global JSON by POST request    
    var submitButton = document.getElementById("lndMeasUploadButton")
    submitButton.addEventListener("click", () => {
        if(JSON.stringify(globalJson)==="{}") {
            alert("Please upload a file.")
            return
        } else {
            sendPost(JSON.parse(JSON.stringify(globalJson)))
        } // end if else
    }) // end submitButton event listener

    document.getElementById("lndMeasFileToLoad").onchange = function loadJsonFile() { // when user uploads file
        var fileReader = new FileReader()
        fileReader.onload=function(e) {
            // parse JSON file
            modelFile = JSON.parse(e.target.result)
            document.getElementById('lndMeasPreviewDiv').style.display = "flex"
            document.getElementById('lndMeasInputBox').innerHTML = JSON.stringify(modelFile, undefined, 2)
            
            var jsonObj = {}
            jsonObj["jsonType"] = "landmark_measurement"
            if(
                !modelFile.hasOwnProperty("gender") &&
                !modelFile.hasOwnProperty("age") &&
                !modelFile.hasOwnProperty("measurements") &&
                !modelFile.hasOwnProperty("features")
            ) {
                document.getElementById('lndMeasInputBox').textContent = "Error: Wrong JSON layout."
                return
            } // end if

            var measJsonObj = {}
            var lndJsonObj = {}

            // parse Measurement elements
            measJsonObj["MeasurementAbbrv"] = []
            measJsonObj["Name"] = []
            measJsonObj["Type"] = []
            measJsonObj["Landmarks"] = []

            for(var i=0; i<modelFile.measurements.length; i++) {
                measJsonObj["MeasurementAbbrv"].push(modelFile.measurements[i]["id"])
                measJsonObj["Name"].push(modelFile.measurements[i]["name"])
                measJsonObj["Type"].push(modelFile.measurements[i]["type"])

                var measLandmarkArr = []
                for(var j=0; j<modelFile.measurements[i].usedFeatures.length; j++) {
                    var usedFeatures = modelFile.measurements[i].usedFeatures[j]
                    if(usedFeatures.search('\'')==-1) {
                        measLandmarkArr.push(usedFeatures)
                    } else {
                        var text2 = usedFeatures.replace(/'/g, "\'\'")
                        measLandmarkArr.push(text2)
                    } // end if else
                } // end j for
                measJsonObj["Landmarks"].push(measLandmarkArr)
            } // end for
            
            // display created JSON in HTML
            document.getElementById('measOutputBox').innerHTML = JSON.stringify(measJsonObj, undefined, 2)
            jsonObj["Measurements"] = measJsonObj

            lndJsonObj["landmarkAbbrv"] = []
            lndJsonObj["landmarkID_Name"] = []
            lndJsonObj["landmarkName"] = []

            for (var i = 0; i < modelFile.features.length; i++) {
                var abbrv = modelFile.features[i]["abbrv"]
                var id_name = modelFile.features[i]["id"]
                var name = modelFile.features[i]["name"]
          
                if(name.search('\'')==-1) {
                  lndJsonObj["landmarkName"].push(name)
                } else {
                  var text2 = name.replace(/'/g, "\'\'")
                  lndJsonObj["landmarkName"].push(text2)
                } // end if else
                
                if(id_name.search('\'')==-1) {
                  lndJsonObj["landmarkID_Name"].push(id_name)
                } else {
                  var text2 = id_name.replace(/'/g, "\'\'")
                  lndJsonObj["landmarkID_Name"].push(text2)
                } // end if else
                  
                lndJsonObj["landmarkAbbrv"].push(abbrv)
              } // end for

              document.getElementById('lndOutputBox').innerHTML = JSON.stringify(lndJsonObj, undefined, 2)

              jsonObj["Landmarks"] = lndJsonObj

              globalJson = jsonObj
        } // end onload
        fileReader.readAsText(this.files[0])
    } // end fileUpload
    
    function sendPost(measJsonObj) { // send POST request to node server
        $.ajax({
        method: 'POST',
        url: 'http://localhost:8000',
        data: measJsonObj,
        datatype: 'application/json',
        success: function(data) { // https://www.tutorialsteacher.com/jquery/jquery-ajax-method
            console.log(data)
            lndMeasPrintOutput(data)
        } // end success
        }) // end ajax
    } // end sendPost
})