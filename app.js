const mysql = require('mysql2');
const express = require('express');

const fs = require('fs');
const { parse } = require('csv-parse');

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
		console.log("MySQL database connected");
		//connection.query("SELECT * FROM birds WHERE species = 'King Parrot';", (err, result) => {console.log(result)});
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
		// connection.query("INSERT INTO birds (species, bird_group) VALUES ('King Parrot', 'Parrots');", function (err, result) {
		// 	if (err) {
		// 		console.log("Cannot insert");
		// 		console.log(err);
		// 	} else {
		// 		console.log('1 row inserted');
		// 	}
		// })
		// connection.query("SELECT * FROM birds;", function (err, result) {
		// 	if (err) {
		// 		console.log("Cannot select table");
		// 		console.log(err);
		// 	} else {
		// 		console.log(result);
		// 	}
		// })
		// const data = [];

		// fs.createReadStream('C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\data\\bird_data.csv')
		// .pipe(parse({ delimiter: '\r\n', from_line: 1}))
		// .on('data', function (row) {
		// 	row = row[0].split(',');
		// 	data.push(row);
		// })
		// .on('error', function (error) {
		// 	console.log(error.message);
		// })	
		// .on('end', function () {
		// 	console.log('Data loaded');
		// 	//connection.query("ALTER TABLE birds ADD Favourites VARCHAR(5);", (err, result) => {console.log(result)});
		// 	connection.query('DELETE FROM birds;');

		// 	for (i = 3; i < data.length; i++) {
		// 		connection.query(`INSERT INTO birds (species, bird_group, United_Kingdom, Vietnam, Australia, New_Zealand, Indonesia, Malaysia, Thailand, Spain, Comments, Favourites, Image_link) VALUES ("${data[i][1]}", "${data[i][2]}", 
		// 			"${data[i][3]}", "${data[i][4]}", "${data[i][5]}", "${data[i][6]}", "${data[i][7]}", "${data[i][8]}",
		// 			"${data[i][9]}", "${data[i][10]}", "${data[i][11]}", "${data[i][12]}", "${data[i][13]}"
		// 			);`, function (err, result) {
		// 		if (err) {
		// 			console.log("Cannot insert");
		// 			console.log(err);
		// 		}
		// 		});
		// 	};
		// 	console.log('Data inserted into SQL table');
		//	connection.query("SELECT * FROM birds WHERE species = 'Pacific Swift';", (err, result) => {console.log(result)});
		//});



	};
});

const app = express();

app.listen('3000', ()=> {
	console.log('Server started on port 3000');
});




