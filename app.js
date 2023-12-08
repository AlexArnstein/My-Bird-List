const mysql = require('mysql2');
const express = require('express');

// Create connection
const connection = mysql.createConnection({
	host	 : '127.0.0.1',
	user	 : 'root',
	database : 'mydb',
	password : ''
});

connection.connect((err) => {
	if (err){
		console.log('Cannot connect to MySQL');
		console.log(err);
	} else {
		console.log("MySQL connected");
		// connection.query("CREATE DATABASE mydb", function (err, result) {
		// 	if (err) {
		// 		console.log("Cannot create database");
		// 		console.log(err);
		// 	} else {
		// 		console.log("Database created");
		// 	}
		// })
		// connection.query("CREATE TABLE birds (species VARCHAR(255), bird_group VARCHAR(255));", function (err, result) {
		// 	if (err) {
		// 		console.log("Cannot create table");
		// 		console.log(err);
		// 	} else {
		// 		console.log("Table created");
		// 	}
		// })
		connection.query("INSERT INTO birds (species, bird_group) VALUES ('King Parrot', 'Parrots');", function (err, result) {
			if (err) {
				console.log("Cannot insert");
				console.log(err);
			} else {
				console.log('1 row inserted');
			}
		})
		connection.query("SELECT * FROM birds;", function (err, result) {
			if (err) {
				console.log("Cannot select table");
				console.log(err);
			} else {
				console.log(result);
			}
		})
	}
})

const app = express();

app.listen('3000', ()=> {
	console.log('Server started on port 3000');
});




