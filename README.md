# ![Node/Express/Mongoose Example App](project-logo.png)

> ### CraigList Node (Express + Mongoose) application [Referred From Here](https://github.com/gothinkster/realworld-example-apps).



### Basic System Requirements

We need following packages required. Presuming you are running Ubuntu 16.04 on your server, use following commands to install all necessary tools.

To install nodejs use followign commands
- `sudo apt-get update`
- `sudo apt-get install nodejs`
- `sudo apt-get install npm`
- `node -v` To check whether nodejs is installed
- `npm -v` To check whether npm is installed

Note one point here, that we are using npm and not nvm. npm is node package manager or we can say that is is tool for installing nodejs packages/dependencies where nvm is node version manager, use to switch between multiple nodejs versions. Since our application doesn't need multiple node versions, we've not installed nvm as we are not using that

To install mongodb use following commands
- `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927`
- `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list`
- `sudo apt-get update`
- `sudo apt-get install -y mongodb-org`
- `cd /lib/systemd/system/`
- `vim mongod.service`

Paste the following code there if not there
```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target
Documentation=https://docs.mongodb.org/manual

[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```
- `systemctl daemon-reload`
- `systemctl start mongod`
- `systemctl enable mongod`
- `mongo --version` or `mongod --version`

Apart from these we can use any asset dependency manager like bower. You can install that too if you wish.

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run dev` to start the local server


# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Error Handling

In `routes/api/index.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.