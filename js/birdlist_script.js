
//  load and process data ------------------

function loadfile (callback) {
	const request = new XMLHttpRequest();
	request.open("get", "http://localhost:8000/data/bird_data.csv");
	
	request.onload = () => {
		try {
			const datastring = request.responseText;
			var data = processdata(datastring);
			callback(data);
		}				
		catch (e) {
			console.warn("could not process data")
		}
	};

	request.send();
};

function processdata (datastring) {
	const data_array = datastring.split(",");
	var newlineindices = [];
	for (i = 0; i < data_array.length; i++) {
		if (data_array[i].includes("\r\n")) {

			var linesplit = data_array[i].split("\r\n");
			data_array.splice(i,1,linesplit[0]);
			data_array.splice(i+1,0,linesplit[1]);
			newlineindices.push(i+1);
		}
	};

	rows = [];
	rows.push(data_array.slice(0,newlineindices[0]));
	for (j = 0; j<newlineindices.length; j++) {
		rows.push(data_array.slice(newlineindices[j],newlineindices[j+1]))
	};
	var totals = rows.splice(1,1);

	columns = [];

	for (k = 0; k < rows.length; k++) {
		row = rows[k];
		row = row.slice(1,row.length);
		rows[k] = row;
		}
	
	for (i = 0; i < row.length; i++) {
		columns.push([]);
		for (j = 0 ; j < rows.length; j++) {
			row = rows[j];
			columns[i].push(row[i]);
		}
	}
	var data = [columns,rows];
return data;
};

//  load and process data ------------------

// populate window  ------------------------

function populate (callback) {
	loadfile(function(data){
		var columns = data[0];
		var species = columns[0].slice(1,columns[0].length);
		birdlistobj = document.getElementById("birdsul");
		birdlistobj.replaceChildren();

		for (i=0; i<species.length; i++) {
			var birdhtml = `<a class='bird'>${species[i]}</a>`;
			var liobject = document.createElement("li");
			liobject.innerHTML = birdhtml;
			birdlistobj.appendChild(liobject);
		}
	dataplus = [data, birdlistobj]
	callback(dataplus);
	});
}

// populate window  ------------------------

//  List functionality ------------------

function listfunction () {
	populate(function(dataplus){ 
		var data = dataplus[0];
		var birdlistobj = dataplus[1];

		var columns = data[0];
		var rows = data[1];
		var species = columns[0].slice(1,columns[0].length);
		var comments_col = columns[rows[0].indexOf("Comments")].slice(1,columns[0].length);
		var countries = rows[0].slice(rows[0].indexOf("Group")+1,rows[0].indexOf("Comments"));

		var imagelinks = columns[columns.length-1].slice(1,columns[columns.length-1].length);
		var mappane = document.getElementById("bird-map");
		var infopane = document.getElementById("bird-info");
		var imagepane = document.getElementById("bird-image");
		var commentspane = document.getElementById("bird-comments");

		var birdupdate = e => {

			bird_selection = e.target.textContent;

			bird_index = species.findIndex( (val) => val === bird_selection);

			image_link = imagelinks[bird_index];

			var image = document.createElement("img");
			image.src = image_link;
			imagepane.replaceChildren();
			imagepane.appendChild(image);
			image.style.height = "100%";
			image.style.display = "table";
			image.style.margin = "0 auto";

			bird_countries = [];
			for (i=rows[0].indexOf("Group")+1; i<rows[0].indexOf("Comments"); i++){
				country_bool = columns[i][bird_index+1];
				if (country_bool != ""){
					bird_countries.push(` ${rows[0][i]}`);
				};
			}

			commentspane.textContent = `${bird_selection} |${bird_countries}\n${comments_col[bird_index]}`;
			commentspane.style.color = "lightslategray";

			console.log("content updated");
		};

		listitems = birdlistobj.children;

		for (let listitem of listitems) {
			listitem.addEventListener("click", birdupdate)
		};
	});
}

// List functionality------------------

// Search funtionality------------------

function searchfunction() {
	populate(function(dataplus){
		var birdlistobj = dataplus[1];
		var searchupdate = e => {
			var searchinput = document.getElementsByClassName("search")[0];
			var filter = searchinput.value.toUpperCase();

			listitems = birdlistobj.children;

			for (let listitem of listitems) {
				bird = listitem.textContent;

				if (bird.toUpperCase().indexOf(filter) > -1) {
				listitem.style.display = "";
				} else {
					listitem.style.display = "none";
				}
			}
		}

		var searchinput = document.getElementsByClassName("search")[0];
		searchinput.addEventListener("keyup", searchupdate);

		});
}

// Search funtionality------------------

$(document).ready(function() {
    searchfunction();
    dropdownfunction();
    listfunction();
});

function dropdownfunction () {
	populate(function(dataplus){
		data = dataplus[0];
		var columns = data[0];
		var country_button = document.getElementById("country-button");
		var country_content = document.getElementById("country-content");

		var group_button = document.getElementById("group-button");
		var group_content = document.getElementById("group-content");

		var dropdownshow = e => {
			var button_clicked = e.target.textContent;
			if (button_clicked == "Country") {
				country_content.style.display = "block";
				group_content.style.display = "none";
			}

			else if (button_clicked == "Bird group") {
				group_content.style.display = "block";
				country_content.style.display = "none";
			}

			else {
				country_content.style.display = "none";
				group_content.style.display = "none";
			}
		}

		country_button.addEventListener("click", dropdownshow);
		group_button.addEventListener("click", dropdownshow);
		document.body.addEventListener("click", dropdownshow);

		var rows = data[1];
		groupcolindex = rows[0].indexOf("Group");

		var groupcol = columns[groupcolindex].slice(1,columns[groupcolindex].length);
		var birdgroups = [...new Set(groupcol)];
		emptyindex = birdgroups.indexOf("");
		birdgroups.splice(emptyindex,1);
		group_content.replaceChildren();

		for (i=0; i<birdgroups.length; i++) {
			var grouphtml = `<a href="#">${birdgroups[i]}</a>`;
			var aobject = document.createElement("a");
			aobject.innerHTML = grouphtml;
			group_content.appendChild(aobject);
		}

		grouphtml = "<a href='#'>Favourites</a>";
		aobject = document.createElement("a");
		aobject.innerHTML = grouphtml;
		group_content.insertBefore(aobject, group_content.firstChild);

		grouphtml = "<a href='#'>All</a>";
		aobject = document.createElement("a");
		aobject.innerHTML = grouphtml;
		group_content.insertBefore(aobject, group_content.firstChild);

		birdlistobj = dataplus[1];
		listitems = birdlistobj.children;

		var favindex = rows[0].indexOf("Favourites");
		var favcol = columns[favindex].slice(1,columns[favindex].length);

		country_content = document.getElementById("country-content");
		countries = [];
		country_indices = [];
		country_birds = [];
		for (i=0; i<country_content.children.length; i++){
			countries.push(country_content.children[i].textContent);
			country_indices.push(rows[0].indexOf(country_content.children[i].textContent))
			country_birds.push(columns[country_indices[i]].slice(1,country_indices[i].length));
		}

		countryhtml = "<a href='#'>Non-UK</a>";
		aobject = document.createElement("a");
		aobject.innerHTML = countryhtml;
		country_content.insertBefore(aobject, country_content.firstChild);

		countryhtml = "<a href='#'>All</a>";
		aobject = document.createElement("a");
		aobject.innerHTML = countryhtml;
		country_content.insertBefore(aobject, country_content.firstChild);
		
		var dropdownfilter = e => {
			var filter_clicked = e.target.textContent;
			if (birdgroups.includes(filter_clicked)) {
				for (i=0;i<groupcol.length;i++){
					if (groupcol[i] == filter_clicked){
						listitems[i].style.display = "";
					}
					else {listitems[i].style.display = "none"}
				}
			}

			else if (filter_clicked == "All") {
				for (i=0;i<groupcol.length;i++){
					listitems[i].style.display = "";
				}
			}

			else if (filter_clicked == "Favourites") {
				for (i=0;i<favcol.length;i++){
					if (favcol[i] == "TRUE") {
						listitems[i].style.display = "";
					}
					else {
						listitems[i].style.display = "none";
					}
				}
			}

			else if (countries.includes(filter_clicked)) {
				country_index = countries.indexOf(filter_clicked);
				for (i=0; i<country_birds[country_index].length; i++){
					if (country_birds[country_index][i] == "TRUE") {
						listitems[i].style.display = "";
					}
					else {
						listitems[i].style.display = "none";
					}
				}
			}

			else if (filter_clicked == "Non-UK") {
				UK_index = countries.indexOf("United Kingdom");
				for (i=0; i<country_birds[UK_index].length; i++){
					if (country_birds[UK_index][i] == "TRUE") {
						listitems[i].style.display = "none";
					}
					else {
						listitems[i].style.display = "";
					}
				}
			}
		}

		var dropdownitems = document.getElementsByClassName("dropdown-content");

		for (i=0; i<dropdownitems.length; i++) {
			for (j=0; j<dropdownitems[i].children.length; j++) {
				dropdownitems[i].children[j].addEventListener("click", dropdownfilter);
			}
		}
	});
}

