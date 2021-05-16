To get the server running, install nodejs software from online. Install the express module using the npm package manager. 
To do that, enter "npm install express" in the command line. Put servicesServer.js and servicesCSV.txt into the same folder. 

Run servicesServer.js in command line with the "node servicesServer.js"command.That will make your computer a lan webserver. 
Then go to a browser and go to localhost:8000/services to see the data. 
You can filter the data more by adding argumentsto the URL based on what's in the csv file. 

Example:

localhost:8000/services?service=foodbank&youth=yes 

localhost:8000 - the server domain
/services - is the API end point for the websever
? - after this symbol we start adding arguments
service=foodbank - an argument key and its value asking for foodbank services
& - if we are adding another key value pair we need an &
youth=yes - a second key value pair looking for services that serve youth

That url sends this object to the webserver.
{service: foodbank, youth: yes} 

The webserver responds with an array of objects representing services that match those key value pairs. 

[{"service":"foodbank","name of provider":"Example Foodbank A","time":" 08:00-12:00","days":" smtwtfs","men":"yes","women":"yes","youth":"yes","families":"yes","pets":"no"}]


Close the server in command line with the control-c shortcut. 

