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
    res.render('pages/ajax_result');
});

app.get('/getData', getData);

app.get('/getAFrame', function(req, res) {
    console.log("In the getAFrame function.");
    res.sendFile(__dirname + '/public/a-frame-test.html');
});

// This function handles requests to the /getData endpoint
function getData(req, res) {
    console.log("In the getData function.");
    
	// use a helper function to query the DB, and provide a callback for when it's done
	getDataFromDb(res, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null) { //|| result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			const data = result[0];
            // This results in an error right now
			//res.status(200).json(data);
            res.send(JSON.stringify(result));
		}
	});
}

// This function gets data from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getDataFromDb(res, callback) {
	console.log("Getting data from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT * FROM test_table";

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
        //res.send(JSON.stringify(result.rows));
        
		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});
} // end of getDataFromDb

// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); });