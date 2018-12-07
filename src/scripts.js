var inputData = [];

//function to handle our xhr response
const handleResponse = (xhr) => {
    //grab the content section
    const content = document.querySelector("#content");
    const type = xhr.getResponseHeader('content-type'); 
    
    const obj = JSON.parse(xhr.response);

    ///parse the response text into a JSON object
    if (type === 'application/json'){
    console.log(obj);
    }
    else if(type === 'text/xml'){
    console.log(xhr.responseXML);
    }
    
    //check the xhr status code and handle accordingly
    switch(xhr.status) {
    case 200: //success
        content.innerHTML = `<b>Success</b> <br> <p id='temp'></p>`;
        if (type === 'application/json'){
        document.getElementById('temp').innerHTML=obj.message;
        }
        else if(type === 'text/xml'){
        document.getElementById('temp').innerHTML=xhr.responseXML.querySelector('message').textContent;
        }
        break;
    case 400: //bad request 
        content.innerHTML = `<b>Bad Request</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    case 401:
        content.innerHTML = `<b>Unauthorized</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    case 403:
        content.innerHTML = `<b>Forbidden</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    case 500:
        content.innerHTML = `<b>Internal Error</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    case 501:
        content.innerHTML = `<b>Not Implemented</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    case 404: //not found (requested resource does not exist)
        content.innerHTML = `<b>Resource Not Found</b> <br> <p id='temp'></p>`;
        document.getElementById('temp').innerHTML=obj.message;
        break;
    default: //default other errors we are not handling in this example
        content.innerHTML = `Error code not implemented by client.`;
        break;
    }
};

//function to send ajax
const sendAjax = (url, acceptedType) => {
    //create a new xhr (ajax) request. 
    //Remember that these are ASYNCHRONOUS
    const xhr = new XMLHttpRequest();
    //set the xhr to a GET request to a certain URL
    xhr.open('GET', url);
    //Set the accept headers to the desired response mime type
    //Server does NOT have to support this. It is a gentle request.
    xhr.setRequestHeader ("Accept", acceptedType);

    //When the xhr loads, call handleResponse and pass the xhr object
    xhr.onload = () => handleResponse(xhr);
    
    //send our ajax request to the server
    xhr.send();
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

$(document).ready(function() {
$.ajax({
    type: "GET",
    url: "/data",
    dataType: "text",
    success: function(data) {
        /*var result = CSVToArray(data,',');
        for(var x = 1; x < result.length; x++)
        {
        if(result[x][4]){  
            var map={
            item: {
                sleepEfficiency: 'efficiency',
                sleepStartTime: 'endTime',
                sleepEndTime: 'endTime',
                sleepDuration: 'totalMinutesAsleep',
                sleepEventTotal: 'totalTimeInBed',
            },
            operate: [{
                run: function(val){
                var sleepStart = new Date(val);
                sleepStart.setMinutes(-sleepEvenTotal);
                sleepStart = formatDate(sleepStart);
                }
            }],
            };
            var test = JSON.parse(result[x][4]);
            //console.log(test);
            var dataTransform = DataTransform(data, map);
            var result = dataTransform.transform();
            console.log(result);
            var temp = 0;
            var sleepEff = "efficiency";
            temp = result[x][4].indexOf(sleepEff);
            sleepEff = parseInt(result[x][4].substring(temp + 12, temp + 15));
            //console.log(sleepEff);
            var sleepEnd = "endTime";
            temp = result[x][4].indexOf(sleepEnd);
            sleepEnd = result[x][4].substring(temp + 10, temp + 33);
            //console.log(sleepEnd);
            var sleepTotal = "totalMinutesAsleep";
            temp = result[x][4].indexOf(sleepTotal);
            sleepTotal = parseInt(result[x][4].substring(temp + 20, temp + 25));
            //console.log(sleepTotal);
            var bedTotal = "totalTimeInBed";
            temp = result[x][4].indexOf(bedTotal);
            bedTotal = parseInt(result[x][4].substring(temp + 16, temp + 20));
            //console.log(bedTotal);
            var sleepStart = new Date(sleepEnd);
            sleepStart.setMinutes(-bedTotal);
            sleepStart = formatDate(sleepStart);
            //console.log(sleepStart);
            var entry={
            sleepEfficiency: sleepEff,
            sleepStartTime: sleepStart,
            sleepEndTime: sleepEnd,
            sleepDuration: bedTotal,
            sleepEventTotal: sleepTotal,
            }
            inputData.push(result);
        }
        }
        console.log(inputData);*/
        $.ajax({
        type: "GET",
        url: "/user",
        dataType: "json",
        success: function(dat) {
            //console.log('JSON GET');
            //console.log(dat);
            //var finalOut = JSON.parse(dat);
            dat.DaysSleep={
            UID: "ec32f960-93fe-11e8-af77-8bd0e3d9a935",
            deviceId: "6RWWKH",
            deviceType: 1,
            sleep_entries: inputData,
            };
            //console.log(JSON.stringify(dat));
            //console.log(dat);
        }
        });
    }
    });
});

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
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

//initialization function
const init = () => {
    const values = document.querySelector("#page");
    const sendButton = document.querySelector("#send");
    const type = document.querySelector("#type");
    
    //functions to call sendAjax for us with the correct parameters
    const send = () => sendAjax(document.getElementById('page').value, document.getElementById('type').value);
    
    //attach the correct functions to the correct events
    sendButton.addEventListener('click', send);
};

window.onload = init;