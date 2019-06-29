const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8888;

/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

// Connects to the database that is connected to this node.js app
//  app: pacific-island-66556, db: postresql-graceful-43235
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, '/public')));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/getData/:id', getData);

function getData(req, res) {
    const sql_test = "SELECT * FROM test_table WHERE id = $1::int;";
    console.log("In the getData function.");
    /*
    pool.query(sql_test, params, function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        console.log("Found result: " + JSON.stringify(result.rows));
        // result.rows is returned in JSON format
        res.send(result.rows);
    });
    */
    pool.connect((err, client, release) => {
        if (err)
            return console.error('Error acquiring client', err.stack)
        
        client.query('SELECT * FROM test_table', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows);
            console.log("Found result: " + JSON.stringify(result.rows));
            res.send(JSON.stringify(result.rows));
        });
    });
}

// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); });