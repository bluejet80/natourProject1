/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

//handling uncaught exceptions

process.on('uncaughtException', (err) => {
  console.log('stopping application');
  console.log(err.name, err.message);
  process.exit(1);
});

// connect to database

mongoose.connect(process.env.DATABASE).then(() => {
  //console.log(con.connections);
  console.log('DB connection successful!');
});

//console.log(process.env);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

//safty net handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('stopping application');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
