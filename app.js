var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// has middleware to add later from https://github.com/express-validator/express-validator
//var expressValidator = require('express-validator'); 
const { check, validationResult } = require('express-validator/check');

//MongoDB require
var mongojs = require('mongojs');

//MongoDB
var db = mongojs('customerapp', ['users']);

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
//Set static path, static resources, HTML, Angular frontend etc.
app.use(express.static(path.join(__dirname, 'public')));

//Global variables, like errors
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

var person = {
    name : "Jeff",
    age : 30
}

var users = [
    {
        id: 1,
        first_name : "Jeff",
        last_name : "Dakila",
        email : "jtk@yahoo.com" 
    },
    {
        id: 2,
        first_name : "Man",
        last_name : "Slender",
        email : "slender@outlook.com" 
    }
];



//Middleware for express validator, new shorthand form
//app.use(expressValidator());


//By visiting an app you are dealing with a get request
app.get('/', function(req, res){
    //res.json(person);
    //We are rendering the index view (index.js)

    db.users.find(function(err, docs){
        console.log(docs);

        //Moved the render inside the MongoDB find function
        res.render('index', {
            title : "Customers",
            users: docs
        });
    });

});
//From the form, we are catching the post request and handling input errors
// New express-validator syntax
app.post('/users/add', [
    check("first_name").isLength({min:1}).withMessage('First name is required!'),
    check("last_name").isLength({min:1}).withMessage('Last name is required!')
    ], (req, res) => {
        //req.checkBody('first_name', "First name is required!").isEmpty();
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // console.log("ERRORS!");
            // return res.status(422).json({ errors: errors.array() });
            //We can re-render the view after the error
            res.render('index', {
                title : "Customers",
                users: users,
                errors : errors.array()
            });
        }
        else {

            var newUser = {
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email : req.body.email
            }
            db.users.insert(newUser, function(err, docs){
                if(err){
                    console.log(err);
                }
                else {
                    res.redirect('/');
                }
            });

            console.log(newUser);
            console.log("SUCCESS!");   
        }
});
app.listen(3000, function(){
    console.log('Server started on port 3000...')
});

//cannot get /, which means the homepage, cause we have not set up a route