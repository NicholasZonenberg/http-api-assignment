const fs = require('fs'); // pull in the file system module
var DataTransform = require("node-json-transform").DataTransform;

// Load our index fully into memory.
// THIS IS NOT ALWAYS THE BEST IDEA.
// We are using this for simplicity. Ideally we won't have
// synchronous operations or load entire files into memory.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const csvData = fs.readFileSync(`${__dirname}/../src/testjson.txt`, "utf8");
const userDat = fs.readFileSync(`${__dirname}/../src/user_profile_data.json`);
const js = fs.readFileSync(`${__dirname}/../src/scripts.js`);

// function to handle the index page
const getIndex = (request, response) => {
  // set status code (200 success) and content type
  response.writeHead(200, { 'Content-Type': 'text/html' });
  // write an HTML string or buffer to the response
  response.write(index);
  // send the response to the client.
  response.end();
};

function formatDate (now) {
  var year = "" + now.getFullYear();
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + ".000";
}

const getData = (request, response) => {
  // process the file into a usable format
  var data = processJSON(csvData);
  //console.log(data);
  // go through the data and edit the time format
  for(var x = 0; x < data.length - 1; x++){
    // corrects the Timestamp variable
    var temp = data[x].Timestamp.split(' ');
    data[x].Timestamp=temp[0] + "T" + temp[1] + "Z";
    // handle the sleep data
    if(data[x].sleep){
      // go through all dateTime values and change format
      var dateTimeIndexs = getIndicesOf("dateTime", data[x].sleep, false);
      for(var y = 0; y < dateTimeIndexs.length; y++){
        data[x].sleep = data[x].sleep.slice(0, dateTimeIndexs[y] + 34 + y) + "Z" + data[x].sleep.slice(dateTimeIndexs[y] + 34 + y)
      }
      // go through all endTime values and change format
      var endTimeIndexs = getIndicesOf("endTime", data[x].sleep, false);
      for(var y = 0; y < endTimeIndexs.length; y++){
        data[x].sleep = data[x].sleep.slice(0, endTimeIndexs[y] + 33 + y) + "Z" + data[x].sleep.slice(endTimeIndexs[y] + 33 + y)
      }
      // go through all startTime values and change format
      var startTimeIndexs = getIndicesOf("startTime", data[x].sleep, false);
      for(var y = 0; y < startTimeIndexs.length; y++){
        data[x].sleep = data[x].sleep.slice(0, startTimeIndexs[y] + 35 + y) + "Z" + data[x].sleep.slice(startTimeIndexs[y] + 35 + y)
      }
    }
    if(data[x].activity){
      // go through all startTime values and change format for the activities
      var actStartTimeIndexs = getIndicesOf("startTime", data[x].activity, false);
      for(var y = 0; y < actStartTimeIndexs.length; y++){
        data[x].activity = data[x].activity.slice(0, actStartTimeIndexs[y] + 35 + (y * -5)) + "Z" + data[x].activity.slice(actStartTimeIndexs[y] + 41 + (y * -5))
      }
    }
    
  }
  //console.log(data);
  var output="";
  var jsonTemp="";
  // create the output file
  for(var x = 0; x < data.length - 1; x++){
    jsonTemp = JSON.stringify(data[x]);
    output += jsonTemp + '\n';
  }
  // write the output file
  fs.writeFile("src/output.txt", output, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
  // endTime dateTime startTime originalStartTime

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(csvData);
  response.end();
}

// gets the indexes of all occurances of a substring
function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
      return [];
  }
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
  }
  return indices;
}

// takes in the data and splits it before making it into JSON
function processJSON(data){
  data = data.split('\n');
  for(var x = 0; x < data.length - 1; x++){
    //console.log(x);
    // Handle oddness with the first entry
    if (x == 0){
      data[x] = JSON.parse(data[x].slice(1));
    }
    else{
      data[x] = JSON.parse(data[x])
    }
  }
  return data;
}

function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp((
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
  ),
  "gi"
  );
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){
  // Get the delimiter that was found.
  var strMatchedDelimiter = arrMatches[ 1 ];
  // Check to see if the given delimiter has a length
  // (is not the start of string) and if it matches
  // field delimiter. If id does not, then we know
  // that this delimiter is a row delimiter.
  if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
      ){
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );
  }
  var strMatchedValue;
  // Now that we have our delimiter out of the way,
  // let's check to see which kind of value we
  // captured (quoted or unquoted).
  if (arrMatches[ 2 ]){
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[ 2 ].replace(
      new RegExp( "\"\"", "g" ),
      "\""
      );
  } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[ 3 ];
  }
  // Now that we have our value string, let's add
  // it to the data array.
  arrData[ arrData.length - 1 ].push( strMatchedValue );
  }
  // Return the parsed data.
  console.log( arrData );
  return( arrData );
}
const getJs = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/javascript'});
  response.write(js);
  response.end();
}

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getJson = (request, response) => {
  console.log("returning json");
  console.log(userDat);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(userDat);
  response.end();
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  getIndex,
  getCss,
  getData,
  getJson,
  getJs,
};
