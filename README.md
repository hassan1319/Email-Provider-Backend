# Email-Provider

This is the repo for backend of the project. 

In order to save time, I didn't create migrations and proper models using some CRM, instead I've created a dev db directly using queries ( credentials for which are mentioned in the env below )


## Project Setup
- Clone repo
- You must have node and npm install.
- Install node packages using npm install
- Create the .env file mentioned below
- Run the backend using command: *npm run start*


## Env
DB_HOST="ec2-63-34-223-144.eu-west-1.compute.amazonaws.com"
DB_PORT=5432
DB_NAME="d2o5b5saqvd48h"
DB_USER="aixeqinklekedn"
DB_PASSWORD="4b58ef8bc7a135aaaaf617e3996c76338707ec85621180d3c15c9ab3a403c4e4"


## Project Structure & Details
- App is built using Nodejs, Express ( for routing ) and KnexJS ( raw query builder for nodejs )
- I opted for Knexjs instead of anyother proper CRM or ORM in order to save time. Created db directly using raw queries and apis are built the same
- App.js is the main entry file
- Server -> routes file contain all the app routes
- Server -> controllers contain all the app controllers
- Server -> Utils contain utils
- I've integrated just one email provider for now i.e. aws ses. We can add as many as possible ( details mentioned below )
- Long polling is used to continuously check and send emails


## EMAILS SENDING

###Assumptions: 
- Since email id from which email has to be sent is to be verified, I've added the from email in provider credentials too in db. We can take it from user too, but will have to make sure that only verified emails are sent.
- Also since my ses account isnt commercially verified so it'll as of moment send only from and to my email : muhammadhassan1319@gmail.com 
- You can add your own aws ses credentials in db incase you've any and test.

As of now I've added just 2 providers in db, one naming aws-wrong and one aws-right. Wrong one doesnt have any credentials thus on it the email fails and get assigned to the next provider using round robin.

We can add as many providers as we need, though if we need anyother provder other than aws ses then obviously we'll need to add its implementation too.




