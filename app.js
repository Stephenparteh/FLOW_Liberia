const express = require('express');
const app = express();
const port = 3400;
const serverless = require("serverless-http");
const path = require('path');

// Static files render configurations
app.use('/public', express.static(__dirname + '/public/'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// =============================== Get Routes ==============================

app.get('/', (req, res) => {
    res.render('aws_dashboard');
});

app.get('/community_kiosk', (req, res) => {
    res.render('communities_kiosk_report');
});


// Post Routes


// Hosting Configuration

app.listen(port, () => {
    console.log(`Server is live on: ${port}`);
})