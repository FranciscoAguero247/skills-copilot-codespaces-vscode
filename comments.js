// Create web server application
// 1. Install Node.js
// 2. Create a folder for your application
// 3. Open the folder in VS Code
// 4. Create a file called comments.js
// 5. Copy the code below into your file
// 6. Run the application: node comments.js
// 7. View in browser at http://localhost:8080

// Load Node modules
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var path = require('path');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nodelogin'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

router.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname + '/home.html'));
});

router.get('/register', function(req, res) {
	res.sendFile(path.join(__dirname + '/register.html'));
});

router.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var password2 = req.body.password2;

	if (password == password2) {
		bcrypt.hash(password, 10, function(err, hash) {
			if (err) throw err;
			connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, hash, email], function(error, results, fields) {
				if (error) throw error;
				res.redirect('/login');
			});
		});
	} else {
		res.redirect('/register');
	}
});

router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	if (username && password) {
		connection.query('