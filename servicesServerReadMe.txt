To get the server running, install nodejs software from online. Install the express module in using the npm package manual. To do that, navigate to the directory you have the files in (using the CD command) and run the "npm install express". 

Run servicesServer.js in command line with the "node servicesServer.js"command.That will make your computer a lan webserver. Then go to a browser and go to localhost:80000/allServices to see the data. 

Server options so far: 

URL: localhost:8000/listOfServices
Description: Provides a list of services availible on the server. The service names are based on the CSV file names in the CSVs folder. You an add and remove CSVs and this will be updated automatically. 

Sent: localhost:8000/listOfServices


returned: {"Services":"CommunityMeals, FoodBanks, SeniorMeals"}



URL: localhost:8000/service/"enter service from listOfServices here"
Description: Choose a service from the listOfServices and you'll get back data for that specific service. It is case sensetive. 

Sent: localhost:8000/service/FoodBanks

Returned: 
{"Bellingham Food Bank (main)":{"Name":"Bellingham Food Bank (main)","Address":"1824 Ellis St Bellingham","Phone Number":"360-676-0392","E-mail address":"info@bellinghamfoodbank.org","Website":"https://www.bellinghamfoodbank.org/covid-19-home/","Days":"m w f","weeks":"","Hours":"mon and fri 11 am-3 pm wed 1-6 pm","Registration required":"N","Visits allowed":"2 per week"}}



URL: localhost:8000/services/
Description: See all the data. Good for testing, but maybe not something we use in the main app. 


Close the server in command line with the control-c shortcut. 


