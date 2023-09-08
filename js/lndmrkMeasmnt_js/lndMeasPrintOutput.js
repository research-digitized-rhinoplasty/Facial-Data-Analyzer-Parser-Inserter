lndMeasGlobalCounter = 0

function lndMeasPrintOutput(jsonObj) {
    let outputDivString = "lndMeasResultOutput"
    let outputDiv = document.getElementById(outputDivString)
    outputDiv.innerHTML = ""
    outputDiv.style.display = "block"

    lndMeasGlobalCounter++
    outputDiv.innerHTML += "Actions: " + lndMeasGlobalCounter + "\n\n"

    if(jsonObj.InsLndMrkStatus!==true) {
        lndMeasPrintJsonList(outputDivString)
    } else {outputDiv.innerHTML += "• Landmark insertion success" + "\n\n"}

    if(jsonObj.InsMeasmntStatus!==true) {
        lndMeasPrintJsonList(outputDivString)
    } else {outputDiv.innerHTML += "• Measurement insertion success" + "\n\n"}
} // end printOutput

function lndMeasPrintJsonList(divId) {
    let outputDiv = document.getElementById(divId)
    outputDiv.innerHTML += "Something went wrong. Please try inserting the landmarks or measurements again," +
                          " or check the database schema."
} // end lndMeasPrintJsonList