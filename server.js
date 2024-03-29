const mysql = require('mysql2');
const express = require('express');

// const fs = require('fs');
// const { parse } = require('csv-parse');

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

		connection.query("SELECT * FROM birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				data = result;
				console.log("Data loaded");

				connection.query("DESCRIBE birds;", (err, result) => {
				if (err){
					console.log(err);
				} else {
					headers = result.map(function(value, index) { return value['Field'];});
					table = [headers, data];
				};
				});
			};
		});
	};
});		

const app = express();

app.use(express.urlencoded({ extended: true}));

app.use(express.json());

app.get('/bird-list.html', (req, res) => {
	res.sendFile("C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\bird-list.html");
})

app.get('/totals.html', (req, res) => {
	res.sendFile("C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\totals.html");
})

app.get('/map_large.html', (req, res) => {
	res.sendFile("C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\map_large.html");
})

app.get('/update-list.html', (req, res) => {
	res.sendFile("C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\update-list.html");
})

app.use(express.static("C:\\Users\\alexa\\OneDrive\\Documents\\04 Bird List\\public"));

app.get('/api/table', (req, res) => {
	res.json(table);
})

app.listen('3000', ()=> {
	console.log('Server started on port 3000');
});


// save bird entry function -----------------------------------

app.post('/api/save', (req, res) => {
	console.log("Post received by server")

	bird_entry = req.body;
	
	entry_headers = Object.keys(bird_entry);
	entry_values = Object.values(bird_entry);

	for (i=0; i<entry_values.length; i++) {
		item = entry_values[i];
		if (item == '') {
			entry_values[i] = 'null';
		} else {
			entry_values[i] = `'${entry_values[i]}'`
		};
	};
	
	connection.query(`REPLACE INTO birds (${entry_headers}) VALUES (${entry_values});`, (err, result) => {
			if (err){
				console.log(err);
			} else {
				console.log(result);
			};
	});

	connection.query("SELECT * FROM birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				data = result;
				console.log("Data loaded");

				connection.query("DESCRIBE birds;", (err, result) => {
				if (err){
					console.log(err);
				} else {
					headers = result.map(function(value, index) { return value['Field'];});
					table = [headers, data];
				};
				});
			};
		});

	app.get('/api/table', (req, res) => {
	res.json(table);
	});
});

// delete bird entry function -------------------------------

app.post('/api/delete', (req, res) => {

	species = req.body;

	connection.query(`DELETE FROM birds WHERE species = '${species['species']}';`, (err, result) => {
		if (err){
			console.log(err);
		} else {
			console.log(result);
		};
	});

	connection.query("SELECT * FROM birds;", (err, result) => {
		if (err){
			console.log(err);
		} else {
			data = result;
			console.log("Data loaded");

			connection.query("DESCRIBE birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				headers = result.map(function(value, index) { return value['Field'];});
				table = [headers, data];
			};
			});
		};
	});

	app.get('/api/table', (req, res) => {
	res.json(table);
	});

});

// delete bird group function--------------------------------------

app.post('/api/delete_group', (req, res) => {

	group = req.body;

	connection.query(`UPDATE birds SET bird_group = null WHERE bird_group = '${group['bird_group']}';`, (err, result) => {
		if (err){
			console.log(err);
		} else {
			console.log(result);
		};
	});

	connection.query("SELECT * FROM birds;", (err, result) => {
		if (err){
			console.log(err);
		} else {
			data = result;
			console.log("Data loaded");

			connection.query("DESCRIBE birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				headers = result.map(function(value, index) { return value['Field'];});
				table = [headers, data];
			};
			});
		};
	});

	app.get('/api/table', (req, res) => {
	res.json(table);
	});

});

// new country function ------------------------------------

app.post('/api/new_country', (req, res) => {

	country = req.body;

	connection.query(`ALTER TABLE birds ADD ${country['country']} varchar(5) AFTER Spain;`, (err, result) => {
		if (err){
			console.log(err);
		} else {
			console.log(result);
		};
	});

	connection.query("SELECT * FROM birds;", (err, result) => {
		if (err){
			console.log(err);
		} else {
			data = result;
			console.log("Data loaded");

			connection.query("DESCRIBE birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				headers = result.map(function(value, index) { return value['Field'];});
				table = [headers, data];
			};
			});
		};
	});

	app.get('/api/table', (req, res) => {
	res.json(table);
	});

});

// delete country function ------------------------------------

app.post('/api/delete_country', (req, res) => {

	country = req.body;

	connection.query(`ALTER TABLE birds DROP ${country['country']};`, (err, result) => {
		if (err){
			console.log(err);
		} else {
			console.log(result);
		};
	});

	connection.query("SELECT * FROM birds;", (err, result) => {
		if (err){
			console.log(err);
		} else {
			data = result;
			console.log("Data loaded");

			connection.query("DESCRIBE birds;", (err, result) => {
			if (err){
				console.log(err);
			} else {
				headers = result.map(function(value, index) { return value['Field'];});
				table = [headers, data];
			};
			});
		};
	});

	app.get('/api/table', (req, res) => {
	res.json(table);
	});

});


// // backup database function ---------------------------------

// app.post('/api/backup_sql', (req, res) => {
// 	url = "C:\\xampp\\mysql\\backup\\mydb.bak";
// 	connection.query(`BACKUP DATABASE mydb TO DISK = '${url}';`, (err, result) => {
// 		if (err){
// 			console.log(err);
// 		} else {
// 			console.log(result);
// 		};
// 	});
// });