//Main starting point of the app
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup
//rejestracja middleware
app.use(morgan('combined')); //logging incomming requests
app.use(bodyParser.json({ type: '*/*' })); //parse incomming req to json
router(app);

// Server Setup
const port = process.env.PORT || 3090; //definicja uzywanego portu
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
