function extrapolation(zaJson) {
    var zaJson2 = JSON.parse(JSON.stringify(zaJson));
  
    for(var i=0; i<zaJson2.Landmarks.length; i++) { // iterate through landmarks in copy JSON
      // create random number
      var theNum = randomNum(); // randomNum function
      var xVal = zaJson2.Landmarks[i].xVal;
      var yVal = zaJson2.Landmarks[i].yVal;
      var zVal = zaJson2.Landmarks[i].zVal;
      // there were some type conflicts when using the toFixed function,
      // which is why there are several variable declarations and such
      zaJson2.Landmarks[i].xVal = parseFloat((xVal + theNum).toFixed(2)); // 1527803
      theNum = randomNum();
      zaJson2.Landmarks[i].yVal = parseFloat((yVal + theNum).toFixed(2));
      theNum = randomNum();
      zaJson2.Landmarks[i].zVal = parseFloat((zVal + theNum).toFixed(2));
    } // end vary landmark for
  
    for(var i=0; i<zaJson2.Measurements.length; i++) { // iterate through measurements in copy JSON
      // create random number
      var theNum = randomNum(min=1.0);
      var val = parseFloat(zaJson2.Measurements[i].Value);
      zaJson2.Measurements[i].Value = parseFloat((val + theNum).toFixed(2));
    } // end vary measurement for
  
      if(subjectModels.gender=="") { // insert gender if empty/null
        var coinFlip = Math.floor(Math.random() * 2) + 2
        if(coinFlip%2==0) {
          zaJson2["Gender"] = "M";
        } else {
          zaJson2["Gender"] = "F";
        } // end if else coinFlip
      } else { // else if gender already exists, use that gender
        zaJson2["Gender"] = subjectModels.gender;
      } // end if else gender
      
      if(subjectModels.age=="") { // insert age if empty/null
        zaJson2["Age"] = Math.floor(Math.random()*22) + 18;
      } else { // else if age already exists, use that age
        zaJson2["Age"] = subjectModels.age;
      } // end if else age
      
      if(!subjectModels.hasOwnProperty("FacialSurgery")) { // check if original/created JSON has FacialSurgery element
        // if not, insert random facial surgery
        // list of possible surgeries
        var surgeries = [
          "No Facial Surgery",
          "Brow/forehead lift",
          "Ear pinning",
          "Chin, cheek, or jaw reshaping",
          "Ear reshaping",
          "Eyelid lift",
          "Facelift",
          "Facial implants",
          "Hair replacement surgery",
          "Lip augmentation",
          "Rhinoplasty",
          "Other",
          "Prefer not to specify"
        ]; // end surgeries
        // randomly choose one
        var coinFlip = Math.floor(Math.random()*13);
        zaJson2["FacialSurgery"] = surgeries[coinFlip];      
      } else { // else if facialsurgery already exists, use that surgery
        zaJson2["FacialSurgery"] = subjectModels.facial_surgery;
      } // end if else facial surgery
  
      if(!subjectModels.hasOwnProperty("ethnicity")) { // check if original/created JSON has ethnicity element
        // if not, insert random ethnicity
        // list of possible ethnicities
        var ethnicities = [
          "White",
          "Black or African American",
          "American Indian or Alaska Native",
          "Asian",
          "Native Hawaiian or Other Pacific Islander",
          "Hispanic"
        ]; // end ethnicities
        var coinFlip = Math.floor(Math.random()*5);
        zaJson2["Ethnicity"] = ethnicities[coinFlip];      
      } else { // else if ethnicity already exists, use that ethnicity
        zaJson2["Ethnicity"] = subjectModels.facial_surgery;
      } // end if else ethnicity
      
      return zaJson2
  }
  
  function randomNum(max=5.0, min=2.5) {
    // function for extrapolating data
    // by default, adds a value between -2.5 to 2.5
    var result = ((Math.random() * max) - min).toFixed(2)
    return parseFloat(result)
  } // end randonNum