var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Initialize app, which wll not run now, we need a port
var app = express();


//Middleware: have access to request, and can access next mw
// var logger = function(req, res, next){
//     console.log("Logging");
//     next();
// }

// app.use(logger);

//Set up view engine to EJS

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var person = {
    name : "Jeff",
    age : 30
}

//Set static path, static resources, HTML, Angular frontend etc.
app.use(express.static(path.join(__dirname, 'public')));

//By visiting an app you are dealing with a get request
app.get('/', function(req, res){
    //res.json(person);
    res.render('index', {
        title : "Customers"
    });
});

app.listen(3000, function(){
    console.log('Server started on port 3000...')
});

//cannot get /, which means the homepage, cause we have not set up a route