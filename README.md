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

### User can access `/teas` in browser

1. Change `users` to `teas``
  * In `app.js` change `var users = require('./routes/users');` to:
    * `var teas = require('./routes/teas');`
  * and change `app.use('/users', users);` to:
    * `app.use('/teas', teas);`
  * In `routes/`, rename `users.js` to `teas.js`
    * from this file, remove the line `/* GET users listing. */`
1. Stop and start server, and visit `http://localhost:3000/teas` to ensure all is well.
  * Should just have default text contained within route
1. Test in browser, and COMMIT

### Add bootstrap

1. Go to [http://getbootstrap.com/getting-started/#download](http://getbootstrap.com/getting-started/#download) and click on "Download Bootstrap" (zip file)
1. Unzip, and rename file to just `bootstrap`
1. Move this directory to `/public`
1. Restart server and open [http://localhost:3000/](http://localhost:3000/)
1. Require bootstrap in `/views/layout/jade`, contents of head should be:

  ```
  title= title
  link(rel='stylesheet', href='/bootstrap/css/bootstrap.min.css')
  link(rel='stylesheet', href='/bootstrap/css/bootstrap-responsive.min.css')
  link(rel='stylesheet', href='/stylesheets/style.css')
  script(src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js')
  script(src='/bootstrap/js/bootstrap.min.js')
  ```

1. Refresh index... you should see the font change. Bootstrap is now loading!
1. COMMIT `bootstrap/` files, then COMMIT the rest

# User can see teas in the database on the tea index page

1. Create a "migration" in a new folder `app/migrations/createTeas.js` with the following content:

  ```
  var pg = require('pg');
  var connString = "postgres://@localhost/teas_with_postgresql";

  var client = new pg.Client(connString);
  client.connect();
  var query = client.query('CREATE TABLE teas(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, country_of_origin VARCHAR(50), type VARCHAR(40), oz INTEGER, reorderable BOOLEAN)');
  query.on('end', function() { client.end(); });
  ```

  * run this by executing in terminal: `$ node app/migrations/createTeas.js`
  * NOTE: The folder name "migrations" is arbitrary (I made this decision), but matches well this folder's intent.
1. Verify that this created a table
  * Go to postgres CLI tab, or `$ psql -d postgres`
  * `\c teas_with_postgresql;`
  * `SELECT * FROM teas``
  * you should see an empty table!
1. Add one tea to our table:
  * `INSERT INTO teas(name, country_of_origin, type, oz, reorderable) VALUES ('Yunnan Golden', 'China', 'black', 10, false);`
  * `SELECT * FROM teas`
  * you should see your new tea added to the table
1. View our added tea on the tea index page
  * In `/routes/teas.js`
    * add requires, necessary variables:

      ```
      var pg = require('pg');
      var connString = "postgres://@localhost/teas_with_postgresql"

      var client = new pg.Client(connString)
      ```

    * add route, should end up looking like this:

      ```
      router.get('/', function(req, res, next) {
        var teas = [];
        pg.connect(connString, function(err, client, done) {
          if (err) return console.log(err);
          var query = client.query("SELECT * FROM teas");
          query.on('row', function(row) {
            teas.push(row);
          });
          query.on('end', function() {
            done();
            res.render('teas/index', {teas: teas});
          });
        });
      });
      ```

  * Add view to `views/herbs/index.jade` with content:

    ```
    extends ../layout

    block content

      h1(class="page-header") Check out my freaking awesome tea collection!

      table(class="table")
        thead
          th Name
          th Country of Origin
          th Type
          th Ounces Available
          th Reorderable?
        tbody
          each tea in teas
            tr
              td= tea.name
              td= tea.country_of_origin
              td= tea.type
              td= tea.oz
              td= tea.reorderable ? "Yes" : "No"
    ```

1. Add a link to root index to `/teas`
  * `a(href='/teas') Do you want to check out my freaking awesome tea collection?`
1. Change project title to something that is more descriptive
  * In `/routes/index.js`:
    * `res.render('index', { title: 'My Freaking Awesome Tea Collection' });`
  * Stop and start the browser to see this change
1. Test in browser, and COMMIT

## User can add new teas

1. Add new link for teas in index

  ```
  div(class="page-header")
    a(href="/teas/new" class="btn btn-success pull-right") Add Tea
    h1 Check out my freaking awesome tea collection!
  ```

1. Add route for new tea

  ```
  router.get('/new', function(req, res, next) {
    res.render('teas/new');
  });
  ```

1. Add view for new herb

  ```
  extends ../layout

  block content
    h1(class="page-header") New Tea

    ol(class="breadcrumb")
      li
        a(href="/teas") My Teas`
      li(class="active") New

    form(action='/teas' method='post' class='form-horizontal')

      div(class='form-group')
        label(class="col-sm-2 control-label") Name
        div(class='col-sm-4')
          input(type="text" name="tea[name]" class='form-control')

      div(class='form-group')
        label(class="col-sm-2 control-label") Country of Origin
        div(class='col-sm-4')
          input(type="text" name="tea[country_of_origin]" class='form-control')

      div(class='form-group')
        label(class="col-sm-2 control-label") Type
        div(class='col-sm-4')
          input(type="text" name="tea[type]" class='form-control')

      div(class="form-group")
        label(class="col-sm-2 control-label") Ounces available
        div(class="col-sm-4")
          input(type='number' name='tea[oz]' class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          div(class="checkbox")
          label Is this tea reorderable?
            input(type='checkbox' name='tea[reorderable]' class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          input(type='submit' name='commit' value='Add this tea' class="btn btn-success")
  ```

1. Add create route

  ```
  router.post('/', function(req, res, next) {
    pg.connect(connString, function(err, client, done) {
      if (err) return console.log(err);
      var query = client.query("INSERT INTO teas(name, country_of_origin, type, oz, reorderable) VALUES ($1, $2, $3, $4, $5)", [req.body['tea[name]'], req.body['tea[country_of_origin]'], req.body['tea[type]'],  req.body['tea[oz]'], req.body['tea[reorderable]']]);
      query.on('end', function() {
        done();
        res.redirect('/teas');
      });
    });
  });
  ```

1. Test in browser, and COMMIT
