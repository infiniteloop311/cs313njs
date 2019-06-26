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

app.get('/getPerson', function(req, res){
    console.log("Wrong Function!");
    //This line below does the same as the one below that
    // res.json(["Tony","Lisa","Michael","Ginger","Food"]);
    res.send(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.get('/getPerson/:id/:id2', myGetPerson);
app.get('/getChild/:id', getChild);
app.get('/getParent/:id', getParent);

// my function made for this assignment
function myGetPerson(req, res) {
    var sql = "SELECT * FROM test_table WHERE id=" + req.params.id;
    const sql_test = "SELECT * FROM test_table WHERE id = $1::int;" 
    const sql_test2 = "SELECT * FROM test_table WHERE id = $1::int;";
    const params = [req.params.id];
    const params2 = [req.params.id2];
    
    let result1 = "";
    let result2 = "";
    
    console.log("In the getPerson function.");
    
    pool.query(sql_test, params, function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        console.log("Found result: " + JSON.stringify(result.rows));
        // result.rows is returned in JSON format
        result1 = JSON.stringify(result.rows);
        res.send(result1);
    });
    /*
    pool.query(sql_test, params[1], function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        console.log("Found result: " + JSON.stringify(result.rows));
        // result.rows is returned in JSON format
        res.send(result.rows);
    });
    */
}

function getChild(req, res) {
    var sql = "SELECT * FROM test_table WHERE id=" + req.params.id;
    var sql2 = "SELECT * FROM test_table_relations WHERE child_id=" + req.params.id;
    console.log("In the getChild function.");
    
    pool.query(sql, function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        console.log("Found result: " + JSON.stringify(result.rows));
        // result.rows is returned in JSON format
        res.send(result.rows);
    });
}

function getParent(req, res) {
    var sql = "SELECT * FROM test_table WHERE id=" + req.params.id;
    var sql2 = "SELECT * FROM test_table_relations WHERE parent_id=" + req.params.id;
    console.log("In the getParent function.");
    
    pool.query(sql, function(err, result) {
        if (err)
            console.error("Error in query: " + err);
        
        console.log("Found result: " + JSON.stringify(result.rows));
        // result.rows is returned in JSON format
        res.send(result.rows);
    });
}

// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getPerson(req, res) {
	// First get the person's id
	const id = req.params.id;
    const id2 = req.params.id2;

	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, res, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			const person = result[0];
			res.status(200).json(person);
		}
	});
    
    getPersonFromDb(id2, res, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			const person = result[0];
			res.status(200).json(person);
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getPersonFromDb(id, res, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT * FROM test_table WHERE id = $1::int";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
        res.send(result.rows);
        
		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});
} // end of getPersonFromDb

// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); });