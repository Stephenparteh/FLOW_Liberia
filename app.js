const express = require('express');
const app = express();
const port = 3400;

// Static files render configurations
app.use('/public', express.static(__dirname + '/public/'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Get Routes

app.get('/', (req, res) => {
    res.render('aws_dashboard');
});


// Post Routes


// Hosting Configuration

// app.use("/.netlify/functions/app", router);
// module.exports.handler = serverless(app);

module.exports = {app};

app.listen(port, () => {
    console.log(`Server is live on: ${port}`);
})