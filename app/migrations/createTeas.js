var pg = require('pg');
var connString = "postgres://@localhost/teas_with_postgresql";

var client = new pg.Client(connString);
client.connect();
var query = client.query('CREATE TABLE teas(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, country_of_origin VARCHAR(50), type VARCHAR(40), oz INTEGER, reorderable BOOLEAN)');
query.on('end', function() { client.end(); });
