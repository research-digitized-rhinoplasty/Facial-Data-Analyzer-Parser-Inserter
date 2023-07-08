# Digitized-Rhinoplasty-Participant-Inserter
Locally hosted tool used to insert data into the Digitized Rhinoplasty Web GUI Data Analyzer database.

To use:

1. Input database details:

    * Using a code editor of your choice, open the ```server.js``` file.
    * Adjust the following fields inside the ```con``` MySQL variable:
      * Line 12: ```host``` (endpoint/URL)
      * Line 13: ```port```
      * Line 14: ```user```
      * Line 15: ```password```
      * Line 16: ```database```
     
    * Note: The database you connect to must have the correct schema (```participant```, ```participant_landmark```, ```participant_measurement```, ```landmark```, ```measurement```) for this code to correctly insert data.
  
2. Run node server:

    * Using ```cmd``` or something similar, run the node server (```server.js```).
    * The server runs locally on port 8000. If you wish to change the port, you must change the port number in the following file:
        * ```server.js```
            * Line 8
        * ```index.html```
            * Line 187
         
3. Use the tool:

    * Open the file ```index.html``` in a web browser.
    * Select desired participant features.
    * Upload marked JSON file.
        * Warning: Only JSON files with the right keys/layout will be parsed. To change the conditions, adjust the details inside the ```index.html``` file:
          * Lines 123, 124, 125, and 126
    * Note the 'Output' text box to view the parsed and adjusted JSON object and what was inserted into the database.
