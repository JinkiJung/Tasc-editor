// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 4000;

app.use(express.static('./'));

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(port, function () {
    console.log('Tasc Editor: web server running on '+port+'...');
});


