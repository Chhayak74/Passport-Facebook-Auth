var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash =require('connect-flash');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var dbPath  = "mongodb://localhost/authDb";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");

});


var path=require('path');

//require('./config/passport.js')(passport); //pass passport for configuration

//setting up express application
app.use(morgan('dev'));//for logging all the requests 
app.use(bodyParser.json({limit:'10mb',extended:true})); //get information from html forms
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());//read sessions(required in auth)

app.set('view engine' , 'jade');
app.set('views', path.join(__dirname + '/app/views'));


//required in passport
app.use(session({secret: "topsecret"})); //session secret
app.use(passport.initialize());
app.use(passport.session()); //for persitent login session
app.use(flash()); //connect-flash for flash messages stored in session

require('./config/passport')(passport);

require('./app/controller/routes.js').controllerFunction(app, passport); 


//launch
app.listen(3000 , function(){
	console.log("Auth app listening on port 3000");
});
