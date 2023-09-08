var partGlobalCounter = 0

function partPrintOutput(jsonObj) {
    let outputDivString = "partResultOutput"
    let outputDiv = document.getElementById(outputDivString)
    outputDiv.innerHTML = ""
    // display output div when partPrintOutput is called
    outputDiv.style.display = "block"

    partGlobalCounter++
    outputDiv.innerHTML += "Actions: " + partGlobalCounter + "\n\n"

    if(jsonObj.InsPartStatus!==true) { // check participant insertion status from return JSON
        partPrintJsonList(outputDivString, jsonObj.InsPartStatus, "participants")
    } else {outputDiv.innerHTML += "• Participant insertion success" + "\n\n"}

    if(jsonObj.InsPartLndMrkStatus!==true) { // check participant landmark insertion status from return JSON
        partPrintJsonList(outputDivString, jsonObj.InsPartLndMrkStatus, "participant landmarks")
    } else {outputDiv.innerHTML += "• Participant Landmark insertion success" + "\n\n"}

    if(jsonObj.InsPartMeasmntStatus!==true) { // check participant measurement insertion status from return JSON
        partPrintJsonList(outputDivString, jsonObj.InsPartMeasmntStatus, "participant measurements")
    } else {outputDiv.innerHTML += "• Participant Measurement insertion success" + "\n\n"}
} // end printOutput

function partPrintJsonList(divId, jsonObj, reason) { // print error in output div
    let outputDiv = document.getElementById(divId)
    outputDiv.innerHTML =   "New record insertion stopped\n" +
                            "----------------------------\n" + 
                            outputDiv.innerHTML
    outputDiv.innerHTML +=  "• Unable to insert records for "
                            + reason + "\n"
    
    if(reason=="participants") return

    // print missing landmarks/measurements
    outputDiv.innerHTML += "Missing " + reason + ": " + "\n"
    if(reason=="participant measurements") {
        for(var key in jsonObj.name) {
            outputDiv.innerHTML += "\t(" + jsonObj.type[key] + ") : " + jsonObj.name[key] + "\n"
        } // end for jsonObj
    } else {
        for(var key in jsonObj) {
            outputDiv.innerHTML += "\t" + jsonObj[key] + "\n"
        } // end for jsonObj
    } // end if else
} // end partPrintJsonList