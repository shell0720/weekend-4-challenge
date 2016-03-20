var express = require("express");
var router = express.Router();
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/reminder';
}

router.post('/', function (req, res) {
  console.log('body: ', req.body);
  var task_name = req.body.task;
  var task_status = "uncomplete";

  // connect to DB
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO task (task_name, task_status) VALUES ($1, $2) ' +
      'RETURNING id, task_name, task_status', [task_name, task_status]);

      query.on('row', function (row) {
        result.push(row);
      });

      query.on('end', function () {
        done();
        res.send(result);
      });

      query.on('error', function (error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


router.get('/', function (req, res) {
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM task;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  })
});

router.put('/', function (req, res) {
  console.log('body: ', req.body);
  var task_name = req.body.task;
  var task_status = "completed";

  // connect to DB
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('UPDATE task SET task_status =($2)  WHERE task_name =($1);' ,[task_name, task_status]);

      query.on('row', function (row) {
        result.push(row);
      });

      query.on('end', function () {
        done();
        res.send(result);
      });

      query.on('error', function (error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.delete('/', function (req, res) {
  console.log('body: ', req.body);
  var task_name = req.body.task;

  // connect to DB
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('DELETE FROM task WHERE task_name =($1);' ,[task_name]);

      query.on('row', function (row) {
        result.push(row);
      });

      query.on('end', function () {
        done();
        res.send(result);
      });

      query.on('error', function (error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


module.exports = router;
