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
app.use(express.static(path.join(__dirname, '/public')))

// views is directory for all template files
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile('09ta_form.html', {
        root: path.join(__dirname, './views/pages')
    })
})

// set up a rule that says requests to "/math" should be handled by the
// handleMath function below
app.get('/math', handleMath)
app.post('/math_service', handleMathAJAX)

// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); })


function handleMath(request, response) {
    console.log("In the handleMath function.")
    
    const operation = request.query.operation
	const operand1 = Number(request.query.operand1)
	const operand2 = Number(request.query.operand2)

	// TODO: Here we should check to make sure we have all the correct parameters

	computeOperation(response, operation, operand1, operand2)
}

function handleMathAJAX(request, response) {
    console.log("In the handleMathAJAX function.")
    
    const operation = request.query.operation
	const operand1 = Number(request.query.operand1)
	const operand2 = Number(request.query.operand2)

	// TODO: Here we should check to make sure we have all the correct parameters

	const params = computeOperationAJAX(response, operation, operand1, operand2)
    console.log(params)
    res.send(params)
}

function computeOperation(response, op, left, right) {
    console.log("In the computeOperation function.")
    
    op = op.toLowerCase();

	let result = 0;

	if (op == "add") {
		result = left + right;
	} else if (op == "subtract") {
		result = left - right;		
	} else if (op == "multiply") {
		result = left * right;
	} else if (op == "divide") {
		result = left / right;
	} else {
		// It would be best here to redirect to an "unknown operation"
		// error page or something similar.
	}

	// Set up a JSON object of the values we want to pass along to the EJS result page
	const params = {operation: op, left: left, right: right, result: result};
    
	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('pages/09ta_result', params);
}

function computeOperationAJAX(response, op, left, right) {
    console.log("In the computeOperationAJAX function.")
    
    op = op.toLowerCase();

	let result = 0;

	if (op == "add") {
		result = left + right;
	} else if (op == "subtract") {
		result = left - right;		
	} else if (op == "multiply") {
		result = left * right;
	} else if (op == "divide") {
		result = left / right;
	} else {
		// It would be best here to redirect to an "unknown operation"
		// error page or something similar.
	}

	// Set up a JSON object of the values we want to pass along to the EJS result page
	const params = {operation: op, left: left, right: right, result: result};
    
	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	return params;
}