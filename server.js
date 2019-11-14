'use strict';
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {DATABASE_URL, PORT} = require('./config');

const UserRoute = require('./Routes/user');
const ResturantRoute = require('./Routes/resturant');
const app = express();

app.use(bodyParser({limit: '50mb'}));
app.use(express.json());
app.use('/resturant', ResturantRoute);
app.use('/user', UserRoute);
app.use(cors());
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
