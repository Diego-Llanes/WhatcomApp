// CIS 216 Whatcom-Services Project 
// Project Description: This is the backend logic for web server with 
// an API to list services a person can use from a CSV file. 
//
// To do: Security (https, input validation), error catching, 
//        update serviceData[] if changed from front end. Work more on request handling. 

// Imported Modules//
const fs = require('fs');
const express = require('express'); 

//Data Variable//
let serviceData = {};  //Object that will hold of service objects

//CSV File I/O: Load from data from CSV file to an array of objects. To do: Save object array to CSV file.// 
let filePaths = fs.readdirSync('./CSVs/'); //List of all files in ./CSVs/ file path

function csvToJSON(fileName){
    let serviceObj = {} //Object to be returned 
    let serviceObjKey = 0; //Index for object

    //load data from file
    csv = fs.readFileSync('./CSVs/' + fileName); 
    csv = csv.toString().replace(/\r/g, ''); // removes \r tags from file
    let dataArray = csv.toString().split('\n'); //file divided by line and placed in array

    //Convert data to JSON object
    let header = dataArray[0].split(','); //csv file header
    for(i=1; i<dataArray.length-1; i++){ 
        let obj = {}; 
        let line = dataArray[i].split(',') //CSV line split into an array by comma
        for(j=0; j<line.length; j++){
            obj[header[j]] = line[j]; //CSV element mapped to its header
        }
        serviceObj[serviceObjKey] = obj;
        serviceObjKey++;
    }
    return serviceObj //returned JSON object
}

filePaths.forEach(file => { //Load all CSV files and add JSON objects to serviceData. 
    let fileName = file.split('.')[0];
    serviceData[fileName] = csvToJSON(file);
});

//Express Server: Set express server to listen. Handles incoming requests.// 

const app = express();
const port = 8000; //port server should listen on

//List all services 
app.get('/listOfServices', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /listOfServices`); //log start of request in terminal 

    let resObj = {}; 
    let servicesList = Object.keys(serviceData);
    resObj['Services'] = servicesList .join(', '); 

    res.send(resObj);

    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
});  

//Get data from a specific service or all services
app.get('/service/:serviceKey', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /service/`); //log start of request in terminal 

    let serviceRequested = req.params.serviceKey; 
    let servicesList = Object.keys(serviceData); 

    if(servicesList.indexOf(serviceRequested) == -1){ //if service not found, send error code
        res.status(400).send(); 
    } else {
        res.send(serviceData[serviceRequested]); //return object for specific service
    }

    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
}); 

app.get('/services', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /services`); //log start of request in terminal

    res.send(serviceData);

    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
});


//Set server to start listening
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});

