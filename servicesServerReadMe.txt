To get the server running, install nodejs software from online. Install the express module in using the npm package manual. To do that, navigate to the directory you have the files in (using the CD command) and run the "npm install express". 

Run servicesServer.js in command line with the "node servicesServer.js"command.That will make your computer a lan webserver. Then go to a browser and go to http://<your-ip>/services to see the data. 

Server options so far: 


URL: http://<your-ip>/services/
Description: See all the data. Good for testing, but maybe not something we use in the main app. 

URL: http://<your-ip>/servicesInRange?lat=<enter latitude>&lon=<enter longitude>&range=<maximum range a service can be in miles> 
Description: Returns all services within a set distance of miles of the user. Also lists estimated distance of service. Distance is a rough estimate and meassures in a straight line. 

E.G.: Services within 5 miles of Whatcom Community College 
http://http://10.0.0.25/servicesInRange?lat=48.795870011581115&lon=-122.49594423558223&range=5


URL: http://<your-ip>/typesOfService
Description: Provides a list of services availible on the server. The service names are based on the CSV file names in the CSVs folder. You an add and remove CSVs and this will be updated automatically. 

Sent: http://<your-ip>/listOfService


returned: {"Services":"CommunityMeals, FoodBanks, SeniorMeals"}



URL: http://<your-ip>/service/"enter service from typesOfService here"
Description: Choose a service from the listOfServices and you'll get back data for that specific service. It is case sensetive. 

Sent: http://<your-ip>/service/FoodBanks

Returned: 
{"Bellingham Food Bank":{"Name":"Bellingham Food Bank (main)","Address":"1824 Ellis St Bellingham","Phone Number":"360-676-0392","E-mail address":"info@bellinghamfoodbank.org","Website":"https://www.bellinghamfoodbank.org/covid-19-home/","Days":"m w f","weeks":"","Hours":"mon and fri 11 am-3 pm wed 1-6 pm","Registration required":"N","Visits allowed":"2 per week"}}






Close the server in command line with the control-c shortcut. 


