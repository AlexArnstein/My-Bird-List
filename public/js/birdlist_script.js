
// load data ----------------------------------------------

fetch('/api/table')
		.then(response => response.json())
		.then(table => {
			headers = table[0];
			data = table[1];

			birdlistobj = populate(data);
			listfunctionality(headers, data, birdlistobj);
			searchfunction(birdlistobj);
			dropdownfunction(headers, data, birdlistobj);
			});
		
// populate window -----------------------------------------

function populate(data) {
	birdlistobj = document.getElementById("birdsul");
	birdlistobj.replaceChildren();

	for (i=0; i<data.length; i++) {
		var birdhtml = `<a class='bird'>${data[i]['species']}</a>`;
		var liobject = document.createElement("li");
		liobject.innerHTML = birdhtml;
		birdlistobj.appendChild(liobject);
	};

	return birdlistobj;
};

// List functionality ---------------------------------------

function listfunctionality(headers, data, birdlistobj) {

	var species = data.map(function(value, index) { return value['species'];});
	var comments = data.map(function(value, index) { return value['Comments'];});
	var imagelinks = data.map(function(value, index) { return value['Image_link'];});
	
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

		for (i=headers.indexOf("bird_group")+1; i<headers.indexOf("Comments"); i++){
			country_bool = data[bird_index][headers[i]];

			if (country_bool == "TRUE"){
				bird_countries.push(` ${headers[i]}`);
			};
		};

		if (comments[bird_index] == null) {
			comments[bird_index] = "";
		};

		commentspane.textContent = `${bird_selection} |${bird_countries}\n${comments[bird_index]}`;
		commentspane.style.color = "lightslategray";

		console.log("content updated");
	};

	listitems = birdlistobj.children;

	for (let listitem of listitems) {
		listitem.addEventListener("click", birdupdate)
	};
};

// Search funtionality ----------------------------------------------

function searchfunction(birdlistobj) {
	
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
			};	
		};
	};

	var searchinput = document.getElementsByClassName("search")[0];
	searchinput.addEventListener("keyup", searchupdate);
};

// dropdown filter function ---------------------------------------------

function dropdownfunction(headers, data, birdlistobj) {

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
		};
	};

	country_button.addEventListener("click", dropdownshow);
	group_button.addEventListener("click", dropdownshow);
	document.body.addEventListener("click", dropdownshow);

	var group_col = data.map(function(value, index) { return value['bird_group'];});
	var birdgroups = [...new Set(group_col)];
	emptyindex = birdgroups.indexOf("");
	birdgroups.splice(emptyindex, 1);

	group_content.replaceChildren();
	for (i=0; i<birdgroups.length; i++) {
		var grouphtml = `<a href="#">${birdgroups[i]}</a>`;
		var aobject = document.createElement("a");
		aobject.innerHTML = grouphtml;
		group_content.appendChild(aobject);
	};

	grouphtml = "<a href='#'>Favourites</a>";
	aobject = document.createElement("a");
	aobject.innerHTML = grouphtml;
	group_content.insertBefore(aobject, group_content.firstChild);

	grouphtml = "<a href='#'>All</a>";
	aobject = document.createElement("a");
	aobject.innerHTML = grouphtml;
	group_content.insertBefore(aobject, group_content.firstChild);

	var countries = headers.slice(headers.indexOf("United_Kingdom"), headers.indexOf("Comments"));
	country_content.replaceChildren();
	for (i=0; i<countries.length; i++) {
		var countryhtml = `<a href="#">${countries[i]}</a>`;
		var aobject = document.createElement("a");
		aobject.innerHTML = countryhtml;
		country_content.appendChild(aobject);
	};

	countryhtml = "<a href='#'>Non-UK</a>";
	aobject = document.createElement("a");
	aobject.innerHTML = countryhtml;
	country_content.insertBefore(aobject, country_content.firstChild);

	countryhtml = "<a href='#'>All</a>";
	aobject = document.createElement("a");
	aobject.innerHTML = countryhtml;
	country_content.insertBefore(aobject, country_content.firstChild);

	listitems = birdlistobj.children;

	var favcol = data.map(function(value, index) { return value['Favourites'];});

	var dropdownfilter = e => {
	var filter_clicked = e.target.textContent;

	if (birdgroups.includes(filter_clicked)) {
		for (i=0;i<data.length;i++){
			if (data[i]['bird_group'] == filter_clicked){
				listitems[i].style.display = "";
			}
			else {listitems[i].style.display = "none"};
		};
	}

	else if (filter_clicked == "All") {
		for (i=0;i<data.length;i++){
			listitems[i].style.display = "";
			};
	}

	else if (filter_clicked == "Favourites") {
		for (i=0;i<favcol.length;i++){
			if (favcol[i] == "TRUE") {
				listitems[i].style.display = "";
			}
			else {
				listitems[i].style.display = "none";
			};	
		};
	}

	else if (countries.includes(filter_clicked)) {
		var country_col = data.map(function(value, index) { return value[filter_clicked];});

		for (i=0; i<country_col.length; i++){
			if (country_col[i] == "TRUE") {
				listitems[i].style.display = "";
			}
			else {
				listitems[i].style.display = "none";
			};
		};
	}

	else if (filter_clicked == "Non-UK") {
		uk_col = data.map(function(value, index) { return value["United_Kingdom"];});
		for (i=0; i< uk_col.length; i++){
			if (uk_col[i] == "TRUE") {
				listitems[i].style.display = "none";
			}
			else {
				listitems[i].style.display = "";
			};
		};
	}
	};

	var dropdownitems = document.getElementsByClassName("dropdown-content");

	for (i=0; i<dropdownitems.length; i++) {
		for (j=0; j<dropdownitems[i].children.length; j++) {
			dropdownitems[i].children[j].addEventListener("click", dropdownfilter);
		};
	};
};
