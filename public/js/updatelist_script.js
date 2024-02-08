
// load data ----------------------------------------------

fetch('/api/table')
		.then(response => response.json())
		.then(table => {
			headers = table[0];
			data = table[1];
			update_species(data, headers);
			// birdlistobj = populate(data);
			// listfunctionality(headers, data, birdlistobj);
			// searchfunction(birdlistobj);
			// dropdownfunction(headers, data, birdlistobj);
			});

// select bird ---------------------------------------------

function update_species(data, headers) {

	select_species_button = document.getElementById("select-species");

	var populate_fields = e => {

		select_species_input = document.getElementById("search-species");
		var filter = select_species_input.value.toUpperCase();
		group_column1 = document.getElementById("group-column1");
		group_column2 = document.getElementById("group-column2");
		country_column1 = document.getElementById("country-column1");
		country_column2 = document.getElementById("country-column2");
		fav_checkbox = document.getElementById("fav");
		fav_checkbox.checked = false;
		comments_input = document.getElementById("comments_input");
		imagelink_input = document.getElementById("img_input");

		imagepane = document.getElementById("bird-image");

		var all_species = data.map(function(value, index) { return value['species'];});
		var all_species_upper = all_species.map(function(x){ return x.toUpperCase(); });
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

		if (all_species_upper.includes(filter) == true) {

			var species_index = all_species_upper.indexOf(filter);
			var row = data[species_index];

			var group = row['bird_group'];
			group_column1.replaceChildren();
			group_column2.replaceChildren();

			for (i=0; i< birdgroups.length; i++) {
				g = birdgroups[i];
				var grouphtml = `<a class='country'>${g}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = grouphtml;

				if (g == group) {
					group_column2.appendChild(liobject);
				} else {
					group_column1.appendChild(liobject);
				};
			};

			species_countries = [];
			country_column1.replaceChildren();
			country_column2.replaceChildren();

			for (i=groups_index+1; i<comments_index; i++) {
				var h = headers[i];
				var countryhtml = `<a class='country'>${h}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = countryhtml;

				if (row[h] == 'TRUE') {
					species_countries.push(headers[i]);
					country_column2.appendChild(liobject);

				} else {
					country_column1.appendChild(liobject);
				};
			};
			
			if (row['Favourites'] == 'TRUE') {
				fav_checkbox.checked = true;
			} else {
				fav_checkbox.checked = false;
			};

			comments_input.value = all_comments[species_index];
			imagelink_input.value = all_imagelinks[species_index];

			var image = document.createElement("img");
			image.src = all_imagelinks[species_index];
			imagepane.replaceChildren();
			imagepane.appendChild(image);
			image.style.width = "75%";
			image.style.display = "table";
			image.style.margin = "0 auto";

		} else {
			console.log(false);

			group_column2.replaceChildren();
			group_column1.replaceChildren();

			for (i=0; i< birdgroups.length; i++) {
				g = birdgroups[i];
				var grouphtml = `<a class='country'>${g}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = grouphtml;
				group_column1.appendChild(liobject);
			};

			country_column2.replaceChildren();
			country_column1.replaceChildren();

			for (i=0; i<all_countries.length; i++) {
				var c = all_countries[i];
				var countryhtml = `<a class='country'>${c}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = countryhtml;
				country_column1.appendChild(liobject);
			};
			
			fav_checkbox.checked = false;
			comments_input.value = "";
			imagelink_input.value = "";
			imagepane.replaceChildren();
		}






		
	};

	select_species_button.addEventListener("click", populate_fields);

};







