const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8888

// Connects to the database that is connected to this node.js app
//  app: pacific-island-66556, db: postresql-graceful-43235
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, '/public')));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/getPerson/:id', function(req, res) {
    var sql = "SELECT * FROM test_table WHERE id=" + req.params.id;
    
    console.log("ID: " + req.params.id);
    
    pool.query(sql, function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        if (result.rows.length == 1)
            console.log(res.json(result.row[0]));
    });
});


// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); });