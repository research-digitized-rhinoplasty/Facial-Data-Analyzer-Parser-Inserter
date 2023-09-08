window.addEventListener("load", () => {
    var partDispBtn = document.getElementById("partDisplayButton");
    var partDispDiv = document.getElementById("partParseDiv");
    var lndMeasDispBtn = document.getElementById("lndMeasDisplayButton")
    var lndMeasDispDiv = document.getElementById("lndMeasParseDiv")

    partDispBtn.addEventListener("click", () => {
        lndMeasDispDiv.style.display = "none"
        partDispDiv.style.display = "block"
    }) // end partDispBtn eventListener

    lndMeasDispBtn.addEventListener("click", () => {
        partDispDiv.style.display = "none"
        lndMeasDispDiv.style.display = "block"
    }) // end lndMrkMeasDispBtn eventListener
}) // end window onload