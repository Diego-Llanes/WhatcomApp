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
let serviceData = {};  //Array of service objects

//CSV File I/O: Load from data from CSV file to an array of objects. To do: Save object array to CSV file.// 

filePaths = ['FoodBanks.csv', 'SeniorMeals.csv', 'CommunityMeals.csv'];

function csvToJSON(fileName){
    let serviceObj = {} //Object to be returned 
    let serviceObjKey = 0;

    //load data from file
    csv = fs.readFileSync(fileName); 
    csv = csv.toString().replace(/\r/g, '');
    let dataArray = csv.toString().split('\n'); //file divided by line
    let header = dataArray[0].split(','); //csv file header

    for(i=1; i<dataArray.length-1; i++){
        let obj = {};
        let line = dataArray[i].split(',')
        for(j=0; j<line.length; j++){
            obj[header[j]] = line[j]; 
        }
        serviceObj[serviceObjKey] = obj;
        serviceObjKey++;
    }
    return serviceObj
}

filePaths.forEach(file => {
    let fileName = file.split('.')[0];
    serviceData[fileName] = csvToJSON(file);
});

csvToJSON("FoodBanks.csv");

//Express Server: Set express server to listen. Handles in coming requests.// 

const app = express();
const port = 8000; //port server should listen on

//Request handling
app.get('/services', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress}`); //log start of request in terminal 

    res.send(serviceData);

    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
});  

//Set server to start listening
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});

