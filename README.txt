The code that I created is in:
client/client.html

To launch the webpage:
npm start

To view the transform:
right click on webpage
click inspect
select the console tab

To view the schema validation:
right click on webpage
click inspect
select the console tab
The last value displayed in the console is the valid status of the data.

Schema:
client/client.html
var schema

Function to handle date formatting (used from stack exchange):
formatDate

Function for handeling CSV to usable data (used from stack exchange):
CSVToArray

Code written to handle the data array and get the json that we are looking for (custom):
$(document).ready(function() {