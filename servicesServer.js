// CIS 216 Whatcom-Services Project 
// Project Description: This is the backend logic for web server with 
// an API to list services a person can use from a CSV file. 
//
// To do: Security (https, input validation), error catching, 
//        update serviceData[] if changed from front end. Work more on request handling. 

// Imported Modules//
const fs = require('fs');
const readline = require('readline'); 
const express = require('express'); 


//Data Variable//
let serviceData = [];  //Array of service objects


//CSV File I/O: Load from data from CSV file to an array of objects. To do: Save object array to CSV file.// 
let fileHeader = []; //Stores csv header data from csv file to use as key values in service objects. 

const readLineInterface = readline.createInterface( //Interface for streaming file input line by line. 
    {input: fs.createReadStream('servicesCSV.txt')});

//Extracts header data from CSV file and saves to array. 
function getCSVHeader(line){ 
    let keyArray = line.split(',')
    keyArray.forEach(key => {
        fileHeader.push(key);
    });
    readLineInterface.pause() //Stops readLineInterface processing lines after the header using this method. 
}

// Extracts lines after csv header and saves them as service objects in serviceData array.  
// BUG: csvToObj reads the header again. It shouldn't. 
function csvToObj(line){
    readLineInterface.resume(); //Need to resume readLineInterface paused in getCSVHeader. 
    
    let serviceObj = {}; 
    let lineArray = line.split(','); 

    i = 0; //incrementer for fileHeader array in foreach loop
    lineArray.forEach(value => {
        serviceObj[fileHeader[i]] = value; //add key-value pair to Service object. 
        i++; 
    });
    serviceData.push(serviceObj); //Add service object to array of service objects
}

readLineInterface.on('line', getCSVHeader);
readLineInterface.on('line', csvToObj); 


//Express Server: Set express server to listen. Handles in coming requests.// 

const app = express();
const port = 8000; //port server should listen on

//Request handling
app.get('/services', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress}`); //log start of request in terminal 
    console.log(serviceData);
    const requestKeys = Object.keys(req.query); //Array of keys from the sent request object. 
    let availableServices = []; //Array to send back to requester. 

    for(i=0; i< serviceData.length; i++){ //iterate through service objects
        let addService = true; //service availible by default

        requestKeys.forEach(key => { 
            if(req.query[key] != serviceData[i][key]){  //See if shared request and service key have same value.
                addService = false; //Set service not to be added if service incompatible with request
            }
        })

        if(addService){  //Add service to array to be sent to requester if service compatible. 
            availableServices.push(serviceData[i]);
        }
    }
    
    res.send(availableServices); //Responding with an array that has an object for each availible service 
    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
});  

//Set server to start listening
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});

