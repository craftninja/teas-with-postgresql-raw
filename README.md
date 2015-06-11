# README

## How this heavenly app was created:

### Get the app generated

1. `$ express teas-with-postgresql-raw`
1. `$ cd teas-with-postgresql-raw`
1. `$ git init`
1. `$ git add -A`
1. `$ git commit -m "Initial commit"`

### Add postgres and get connection to db established (and gitignore some stuff)

1. Create README.md and take the most amazing notes evah
1. Add to `package.json` dependencies:
  * `"pg": "~4.3.0",`
1. `$ npm install`
1. Create `.gitignore` file with the content:
  * `node-modules/**`
1. Create a postgres database with same name as app
  * log into postgres CLI
    * `$ psql -d postgres`
  * create database
    * if you use `-` in your app name, replace with underscores `_`
    * `=# CREATE DATABASE teas_with_postgresql;`
  * Keep this CLI tab open, we will be using this periodically
1. Add the following to `app.js`:
  * NOTE: if you use `-` in your app name, replace with underscores `_`

  ```
  var pg = require('pg');

  var connString = "postgres://@localhost/herbs_with_postgresql";

  var client = new pg.Client(connString);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log("PostgreSQL is totally hooking it up: ", result.rows[0].theTime);
      client.end();
    });
  });
  ```
1. Fire up that server, and see if you have any errors...
  * `DEBUG=herbs-with-postgresql:* npm start`
  * Make sure your server has the content 'PostgreSQL is totally hooking it up: ' with the date and time
  * Open [http://localhost:3000/](http://localhost:3000/) to see default view and make sure all is loading properly
1. COMMIT `.gitignore`, then COMMIT the rest
