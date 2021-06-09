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
    let serviceObj = {} //Object that will have an object for each CSV line
    let serviceObjKey = ''; //Index for object

    //load data from file
    csv = fs.readFileSync('./CSVs/' + fileName); 
    csv = csv.toString().replace(/\r/g, ''); // removes \r tags from data
    let dataArray = csv.toString().split('\n'); 

    //Convert data to JSON object
    let header = dataArray[0].split(','); //csv file header
    for(i=1; i<dataArray.length-1; i++){ //Starts at 1 to skip header
        let obj = {}; 
        let line = dataArray[i].split(',') 
        serviceObjKey = line[0]; //Set key as first element in line (which should be name)
        for(j=0; j<line.length; j++){
            obj[header[j]] = line[j]; //CSV element mapped to its header
        }
        serviceObj[serviceObjKey] = obj; 
    }
    return serviceObj //returned JSON object
}

//Load all CSV files and add to serviceData. 
filePaths.forEach(file => { 
    fileSplit = file.split('.'); 
    let fileName = fileSplit[0];
    if(fileSplit[1] == 'csv'){ //Check file extension
        serviceData[fileName] = csvToJSON(file);
    } 
});

//Distance Calculation and Sorting Methods//

// Note: Haversine's formula calculates the distance between two points on a sphere. 
//       Can give a loose estimate for distance between two coordiantes. 
/* Distance between two lat/lng coordinates in km using the Haversine formula */  
function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
    if (typeof miles === "undefined"){miles=false;}
    function deg2rad(deg){return deg * (Math.PI/180);}
    function square(x){return Math.pow(x, 2);}
    var r=6371; // radius of the earth in km
    lat1=deg2rad(lat1);
    lat2=deg2rad(lat2);
    var lat_dif=lat2-lat1;
    var lng_dif=deg2rad(lng2-lng1);
    var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
    var d=2*r*Math.asin(Math.sqrt(a));
    if (miles){return d * 0.621371;} //return miles
    else{return d;} //return km
  }
  /* Copyright 2016, Chris Youderian, SimpleMaps, http://simplemaps.com/resources/location-distance
   Released under MIT license - https://opensource.org/licenses/MIT */ 

//Merge sort algorithm by Jake//  

function merge(array, left, middle, right)
{
    var new1 = middle - left + 1;
    var new2 = right - middle;

    var leftArray = new Array(new1);
    var rightArray = new Array(new2);

    for (var i = 0; i < new1; i++) {
        leftArray[i] = array[left + i];
    }
    for (var j = 0; j < new2; j++){
        rightArray[j] = array[middle + 1 + j];
    }

    var first = 0;
    var second = 0;
    var merge = left;

    while (first < new1 && second < new2) {
        if (leftArray[first] <= rightArray[second]) {
            array[merge] = leftArray[first];
            first++;
        }
        else {
            array[merge] = rightArray[second];
            second++;
        }
        merge++;
    }
    while (first < new1) {
        array[merge] = leftArray[first];
        first++;
        merge++;
    }
    while (second < new2) {
        array[merge] = rightArray[second];
        second++;
        merge++;
    }
}

function mergeSort(startArray,left, right){
    if(left>=right ){
        return;
    }
    var middle=left+ parseInt((right-left)/2);
    mergeSort(startArray,left,middle);
    mergeSort(startArray,middle+1,right);
    merge(startArray,left,middle,right);
}

function removeName(array) {
    var arrayChopped = [];
    for(var i = 0; i < array.length; i++){
        arrayChopped[i]=array[i][1];
    }
    return arrayChopped;
}

function matchNames(array, chop){
    var matched = Array.from(Array(chop.length), () => new Array(2));
    for(var i = 0; i < chop.length; i++){
        for(var j = 0; j < chop.length; j++){
            if(array[i][1]==chop[j]){
                matched[j][0] = array[i][0];
                matched[j][1] = chop[j];
                array[i][1]=null;
            }
        }
    }
    return matched;
}

function removeName(array) {
    var arrayChopped = [];
    for(var i = 0; i < array.length; i++){
        arrayChopped[i]=array[i][1];
    }
    return arrayChopped;
}

function sortArray(array){

    var chopped = removeName(array);
    mergeSort(chopped, 0, chopped.length - 1);
    var matched = matchNames(array,chopped);
    return matched;
}


//Express Server: Set express server to listen. Handles incoming requests.// 

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000; //Port for Heroku
}

//List all service types
app.get('/typesOfService', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /listOfServices`); //log start of request in terminal 

    let resObj = {}; 
    let servicesList = Object.keys(serviceData);
    let i = 0;
    servicesList.forEach(type =>{
        resObj[i] = type;
        i++;
    }); 
    
    res.send(resObj);

    console.log(`Request from ${req.socket.remoteAddress} resolved`); //Log end of request in terminal 
});  

//Get data from a specific service type
app.get('/service/:serviceKey', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /service/`); 

    let serviceRequested = req.params.serviceKey; 
    let servicesList = Object.keys(serviceData); 

    if(servicesList.indexOf(serviceRequested) == -1){ //if service not found, send error code
        res.status(400).send(); 
    } else {
        res.send(serviceData[serviceRequested]); //return object for specific service
    }

    console.log(`Request from ${req.socket.remoteAddress} resolved`); 
}); 

//Get data from all services
app.get('/services', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /services`); 

    res.send(serviceData);

    console.log(`Request from ${req.socket.remoteAddress} resolved`); 
});

//Get services within a certain range of the user and sort by distance. 
//Note: Default max range is 5 miles if not specificed. 
app.get('/servicesInRange', (req, res) => {
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /servicesInRange`); 

    //JSON to be returned
    let returnedServices = {}; 

    //Request paramaters
    const lat = req.query.lat; 
    const lon = req.query.lon;
    const range = req.query.range; //Maximum range from user 

    //Filtering servicesData by distance and returning copy of it//
    const serviceDataKeys = Object.keys(serviceData); 
    serviceDataKeys.forEach(serviceType => {
        returnedServices[serviceType] = {}; //Listing service type in returned JSON. 
        const serviceKeys = Object.keys(serviceData[serviceType]);
        let distanceArray = []; //Array to sort services and their distance from user.  

        //Calculating distances
        serviceKeys.forEach(service => {
            const coordinates = serviceData[serviceType][service]['coordinates'].split(' ');
            const latDestination = coordinates[0];
            const lonDestination = coordinates[1];
            const distance = getDistanceFromLatLng(lat, lon, latDestination, lonDestination, "miles");
            if(distance <= range){ //Filtering services by distance
                distanceArray.push([service, distance]); 
            }
        });

        //Sort distance array 
        distanceArray = sortArray(distanceArray); 
        

        //Store services in returned JSON in distance order
        distanceArray.forEach( distanceArray => {
            const serviceName = distanceArray[0];
            const serviceDistance = distanceArray[1];
            let serviceObj = JSON.parse(JSON.stringify(serviceData[serviceType][serviceName])); //Create copy of service obj
            serviceObj['estimated distance'] = serviceDistance.toString().substring(0,3); 
            returnedServices[serviceType][serviceName] = serviceObj;
        });
    });

    res.send(returnedServices);

    console.log(`Incoming request from: ${req.socket.remoteAddress} for /servicesInRange`); 
});
//Get services within a certain range of the user and sort by distance.  
    app.get('/serviceInRange/:serviceType', (req, res) => {

    let serviceType = req.params.serviceType; //Service type listed in URI
    
    console.log(`Incoming request from: ${req.socket.remoteAddress} for /serviceInRange/${serviceType}`); 

    //JSON to be returned
    let returnedServices = {}; 
    

    //Request paramaters
    const lat = req.query.lat; 
    const lon = req.query.lon;
    const range = req.query.range; //Maximum range from user 

     //Filtering servicesData by distance and returning copy of it//
    returnedServices = {}; //Listing service type in returned JSON. 
    const serviceKeys = Object.keys(serviceData[serviceType]);
    let distanceArray = []; //Array to sort services and their distance from user.  

    //Calculating distances
    serviceKeys.forEach(service => {
        const coordinates = serviceData[serviceType][service]['coordinates'].split(' ');
        const latDestination = coordinates[0];
        const lonDestination = coordinates[1];
        const distance = getDistanceFromLatLng(lat, lon, latDestination, lonDestination, "miles");
        if(distance <= range){ //Filtering services by distance
            distanceArray.push([service, distance]); 
        }
    });

    //Sort distance array 
    distanceArray = sortArray(distanceArray); 
    console.log(distanceArray)

    //Store services in returned JSON in distance order
    distanceArray.forEach( distanceArray => {
        const serviceName = distanceArray[0];
        const serviceDistance = distanceArray[1];
        let serviceObj = JSON.parse(JSON.stringify(serviceData[serviceType][serviceName])); //Create copy of service obj
        //serviceObj['estimated distance'] = serviceDistance.toString().substring(0,3); 
        returnedServices[serviceName] = serviceObj;
    });


    res.send(returnedServices);

    console.log(`Incoming request from: ${req.socket.remoteAddress} for /serviceInRange/${serviceType}`); 
});

//Set server to start listening
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});