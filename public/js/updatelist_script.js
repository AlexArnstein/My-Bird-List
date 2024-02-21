
// load data ----------------------------------------------

fetch('/api/table')
		.then(response => response.json())
		.then(table => {
			headers = table[0];
			data = table[1];
			data_p = process_data(data, headers);

			objects = get_objects();

			select_species_button = objects[1];
			select_species_button.addEventListener("click", populate_objects);
			select_species_button.Params = [objects, data_p, headers];
			
			save_button = objects[11];
			save_button.addEventListener("click", save_changes);
			save_button.Params = [objects, data_p];

			delete_button = objects[12];
			delete_button.addEventListener("click", delete_entry);
			delete_button.Params = [objects, data_p];

			});

// process data -------------------------------------------

function process_data(data, headers) {

	var all_species = data.map(function(value, index) { return value['species'];});
	var group_col = data.map(function(value, index) { return value['bird_group'];});
	var birdgroups = [...new Set(group_col)];
	emptyindex = birdgroups.indexOf("");
	birdgroups.splice(emptyindex, 1);
	birdgroups.unshift("None");
	groups_index = headers.indexOf("bird_group");
	comments_index = headers.indexOf("Comments");
	var all_countries = headers.slice(groups_index +1, comments_index);
	var all_comments = data.map(function(value, index) { return value['Comments'];});
	var all_imagelinks = data.map(function(value, index) { return value['Image_link'];});

	data_p = [data, all_species, birdgroups, all_countries, all_comments, all_imagelinks];

	return data_p
};

// get objects ---------------------------------------------

function get_objects() {

	select_species_input = document.getElementById("search-species");
	select_species_button = document.getElementById("select-species");
	//var filter = select_species_input.value.toUpperCase();
	group_column1 = document.getElementById("group-column1");
	group_column2 = document.getElementById("group-column2");
	country_column1 = document.getElementById("country-column1");
	country_column2 = document.getElementById("country-column2");
	fav_checkbox = document.getElementById("fav");
	comments_input = document.getElementById("comments_input");
	comments_select = document.getElementById("select-comments");
	imagelink_input = document.getElementById("img_input");
	imagelink_select = document.getElementById("select-img");
	save_button = document.getElementById("save-species");
	delete_button = document.getElementById("delete-species");
	imagepane = document.getElementById("bird-image");
	commentspane = document.getElementById("bird-comments");

	objects = [select_species_input, select_species_button, group_column1,
		group_column2, country_column1, country_column2, fav_checkbox, comments_input,
		comments_select, imagelink_input, imagelink_select, save_button, delete_button, imagepane,
		commentspane];

	return objects
};

// click group item ---------------------------------------

function click_column(evt) {

	var tgt = evt.target.closest("li");
	column_id = tgt.closest("div").id;
	column_type = column_id.slice(0, column_id.indexOf("-"));
	column_number = column_id.slice(-1);

	if (column_type == "group") {

		var group_column1 = document.getElementById("group-column1");
		var group_column2 = document.getElementById("group-column2");

		if (column_number == 1) {

			n = group_column2.childElementCount;

			if (n == 0) {

				group_column1.removeChild(tgt);
				group_column2.appendChild(tgt);
			};

		} else {

			group_column2.removeChild(tgt);
			group_column1.appendChild(tgt);
		};

	} else {

		var country_column1 = document.getElementById("country-column1");
		var country_column2 = document.getElementById("country-column2");
		var select_species_input = document.getElementById("search-species");
		var comments_input = document.getElementById("comments_input");
		var commentspane = document.getElementById("bird-comments");

		if (column_number == 1) {

			country_column1.removeChild(tgt);
			country_column2.appendChild(tgt);

			var nodelist = country_column2.childNodes;
			species_countries = [];
			for (i=0; i<nodelist.length; i++) {
				country = nodelist[i].innerText;
				species_countries.push(country);
			};

			commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;

		} else {

			n = country_column2.childElementCount;

			if (n >= 2) {

				country_column2.removeChild(tgt);
				country_column1.appendChild(tgt);

				var nodelist = country_column2.childNodes;
				species_countries = [];
				for (i=0; i<nodelist.length; i++) {
					country = nodelist[i].innerText;
					species_countries.push(country);
				};
				
				commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
			};
		};
	};
};

// populate objects ----------------------------------------

function populate_objects(evt) {

	parameters = evt.currentTarget.Params;
	objects = parameters[0];
	data_p = parameters[1]; 
	headers = parameters[2];

	data = data_p[0];
	var all_species = data_p[1];
	birdgroups = data_p[2];
	all_countries = data_p[3];
	all_comments = data_p[4];
	all_imagelinks = data_p[5];

	select_species_input = objects[0];	
	group_column1 = objects[2];
	group_column2 = objects[3];
	country_column1 = objects[4];
	country_column2 = objects[5];
	fav_checkbox = objects[6];
	comments_input = objects[7];
	comments_select = objects[8];
	imagelink_input = objects[9];
	imagelink_select = objects[10];
	save_button = objects[11];
	imagepane = objects[13];
	commentspane = objects[14];

	var filter = select_species_input.value.toUpperCase();
	var all_species_upper = all_species.map(function(x){ return x.toUpperCase(); });

	group_column1.replaceChildren();
	group_column2.replaceChildren();

	for (i=0; i< birdgroups.length; i++) {
		g = birdgroups[i];
		var grouphtml = `<a class='group'>${g}</a>`;
		var liobject = document.createElement("li");
		liobject.innerHTML = grouphtml;
		liobject.addEventListener("click", click_column);
		group_column1.appendChild(liobject);
	};

	species_countries = [];
	country_column1.replaceChildren();
	country_column2.replaceChildren();

	for (i=groups_index+1; i<comments_index; i++) {
		var h = headers[i];
		var countryhtml = `<a class='country'>${h}</a>`;
		var liobject = document.createElement("li");
		liobject.innerHTML = countryhtml;
		liobject.addEventListener("click", click_column);
		country_column1.appendChild(liobject);
	};

	fav_checkbox.checked = false;

	comments_input.value = "";
	commentspane.textContent = "";
	commentspane.style.color = "lightslategray";
	commentspane.style.fontSize = "12px";

	var comment_update = e => {
		commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
	};

	comments_select.addEventListener("click", comment_update);

	imagelink_input.value = "";
	imagepane.replaceChildren();
	var image = document.createElement("img");
	image.style.maxWidth = "100%";
	image.style.maxHeight = "100%";
	image.style.height = "auto";
	image.style.display = "table";
	image.style.margin = "0 auto";

	var img_update = e => {
		image.src = imagelink_input.value;
		imagepane.replaceChildren();
		imagepane.appendChild(image);
	};

	imagelink_select.addEventListener("click", img_update);

	if (all_species_upper.includes(filter) == true) {

		var species_index = all_species_upper.indexOf(filter);
		var row = data[species_index];
		var group = row['bird_group'];

		var nodelist = group_column1.childNodes;

		for (i=0; i< birdgroups.length; i++) {
			g = birdgroups[i];
			if (g == group) {
				group_column2.appendChild(nodelist[i]);				
			};
		};

		var nodelist = country_column1.childNodes;

		for (i=groups_index+1; i<comments_index; i++) {
			var h = headers[i];
			if (row[h] == 'TRUE') {
				species_countries.push(headers[i]);
				
				for (j=0; j < nodelist.length; j++) {
					node = nodelist[j];
					country = node.innerText;
					if (country == h) {
						country_column2.appendChild(node);
					};
				};
			};
		};
			
		if (row['Favourites'] == 'TRUE') {
			fav_checkbox.checked = true;
		};

		comments_input.value = all_comments[species_index];

		commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${all_comments[species_index]}`;

		imagelink_input.value = all_imagelinks[species_index];
		image.src = all_imagelinks[species_index];
		imagepane.appendChild(image);
	};
};

// save changes --------------------------------------------

function save_changes(evt) {

	parameters = evt.currentTarget.Params;
	objects = parameters[0];
	data_p = parameters[1];

	data = data_p[0];
	all_countries = data_p[3];
	
	select_species_input = objects[0];	
	group_column1 = objects[2];
	group_column2 = objects[3];
	country_column1 = objects[4];
	country_column2 = objects[5];
	fav_checkbox = objects[6];
	comments_input = objects[7];
	comments_select = objects[8];
	imagelink_input = objects[9];
	imagelink_select = objects[10];
	save_button = objects[11];
	delete_button = objects[12];
	imagepane = objects[13];
	commentspane = objects[14];

	if (group_column2.childNodes.length == 1) {
		group = group_column2.childNodes[0].innerText;
	} else {
		group = '';
	};

	bird_entry = {'species':select_species_input.value, 'bird_group':group};

	var nodelist = country_column2.childNodes;
	species_countries = [];
	for (i=0; i<nodelist.length; i++) {
		node = nodelist[i];
		species_countries.push(node.innerText);
	};

	for (i=0; i<all_countries.length; i++) {
		country = all_countries[i];
		if (species_countries.includes(country)) {
			bird_entry[`${country}`] = 'TRUE';
		} else {
			bird_entry[`${country}`] = '';
		};
	};

	if (fav_checkbox.checked == true) {
		bird_entry['Favourites'] = 'TRUE';
	} else {
		bird_entry['Favourites'] = '';
	};

	if (comments_input.value.length > 0) {
		bird_entry['Comments'] = comments_input.value;
	} else {
		bird_entry['Comments'] = '';
	};

	if (imagelink_input.value.length > 0) {
		bird_entry['Image_link'] = imagelink_input.value;
	} else {
		bird_entry['Image_link'] = '';
	};

	dataToSend = JSON.stringify(bird_entry);

	fetch('/api/save', {
		method: 'POST',
		mode: 'cors',
		headers: {'Accept': 'application/json',
			"Content-type": "application/json"},
		body: dataToSend

	}).then(response => response.text()).then(response => {
		
	}).catch(error => console.log(error));

	location.reload();
};

// delete entry --------------------------------------------

function delete_entry(evt) {

	parameters = evt.currentTarget.Params;
	objects = parameters[0];
	data_p = parameters[1];

	data = data_p[0];
	
	select_species_input = objects[0];	
	var all_species = data_p[1];
	var filter = select_species_input.value.toUpperCase();
	var all_species_upper = all_species.map(function(x){ return x.toUpperCase(); });

	if (all_species_upper.includes(filter) == true) {

		index = all_species_upper.indexOf(filter);
		species = all_species[index];

		speciesToSend = JSON.stringify({'species':species});
		console.log(speciesToSend);
		//speciesToSend = JSON.parse(species);

		fetch('/api/delete', {
			method: 'POST',
			mode: 'cors',
			headers: {'Accept': 'application/json',
				"Content-type": "application/json"},
			body: speciesToSend

		}).then(response => response.text()).then(response => {
			
		}).catch(error => console.log(error));

		location.reload();

	};
};
