var express = require('express');
var index = require("./routes/index");
var task = require("./routes/task");
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/reminder';
}

pg.connect(connectionString, function (err, client, done) {
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS task (' +
    'id SERIAL PRIMARY KEY,' +
    'task_name varchar(80) NOT NULL,'+
    'task_status varchar(80) NOT NULL);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    done();
  });
}
});

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/task", task);
app.use("/", index);


app.listen(port, function() {
  console.log('Listening for requests on port', port);
});
