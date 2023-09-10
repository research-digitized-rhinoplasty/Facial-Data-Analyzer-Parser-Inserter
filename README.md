# Digitized-Rhinoplasty-JSON-Parser-And-Record-Inserter
Locally hosted tool used to insert data such as participant records and/or landmarks and/or measurements into the Digitized Rhinoplasty Web GUI Data Analyzer database.

To use:


1. Install npm dependencies:

    * Open ```cmd``` or something similar and navigate to the project directory (/).
    * Confirm the details inside package.json (packages: cors, express, mysql), then type ```npm install```.
    * A folder called ```npm_modules``` will be downloaded to the project directory.
    * If for any reason you wish to delete the project files and run into issues deleting ```npm_modules```:
        * Using ```cmd``` or something similar, in the project directory, run the command ```npx rimraf --glob ./node_modules```.

2. Input database details:

    * Using a code editor of your choice, open the ```node/nodeMySqlFn.js``` file.
    * Adjust the following fields inside the ```con``` MySQL variable:
      * Line 4: ```host``` (endpoint/URL)
      * Line 5: ```port```
      * Line 6: ```user```
      * Line 7: ```password```
      * Line 8: ```database```
     
    * Note: The database you connect to must have the correct schema for this code to correctly insert data.
  
3. Run node server:

    * Using ```cmd``` or something similar, run the node server (```node/server.js```).
    * The server runs locally on port 8000. If you wish to change the port, you must change the port number in the following files:
        * ```node/server.js```
            * Line 8
        * ```js/participant_js/partJsonParse.js```
            * Line 101
        * ```js/lndMrkMeasmnt_js/lndMeasJsonParse.js```
            * Line 105
         
4. Use the software:

    * Open the file ```index.html``` in a web browser.
    * Select desired participant features.
    * Upload marked JSON file.
        * Warning: Only JSON files with the right keys/layout will be parsed. To change the conditions, adjust the details inside the ```index.html``` file.
    * Note the 'Output' text box to view the parsed JSON object from the input JSON file and what is sent to the node server.
    * After pressing the 'upload' button, an additonal textarea element will appear underneath the 'upload' button that displays the database record insertion status.
       * If landmark or measurement values are missing from the database that are preventing the participant JSON file to be inserted, go to the 'Landmarks & Measurements' section by pressing the labelled button and upload the same file. The software will parse the existing landmarks and measurements and add new ones to the database. Afterwards, try inserting the participant JSON file again.
