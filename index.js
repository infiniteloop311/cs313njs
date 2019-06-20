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
    res.sendFile('postal_form.html', {
        root: path.join(__dirname, './views/pages')
    })
})

app.get('/postal', postalCalculation)

// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); })

function postalCalculation(request, response) {
    console.log("In the postalCalculation function.");
    
    const category = request.query.category;
	const weight = Number(request.query.weight);
    let result = 0;
    
    const params = {category: category, weight: weight, result: result};
    
    response.render('pages/postal_result', params);
}