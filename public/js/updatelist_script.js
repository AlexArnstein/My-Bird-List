
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
		comments_select = document.getElementById("select-comments");
		imagelink_input = document.getElementById("img_input");
		imagelink_select = document.getElementById("select-img");
		save_button = document.getElementById("save-species");
		imagepane = document.getElementById("bird-image");
		commentspane = document.getElementById("bird-comments");

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

			var click_group1 = e => {
					var tgt = e.target.closest("li");
					n = group_column2.childElementCount;
					if (n == 0) {
						tgt.removeEventListener("click", click_group1);
						tgt.addEventListener("click", click_group2);
						group_column1.removeChild(tgt);
						group_column2.appendChild(tgt);
					};
				};

			var click_group2 = e => {
					var tgt = e.target.closest("li");
					tgt.removeEventListener("click", click_group2);
					tgt.addEventListener("click", click_group1);
					group_column2.removeChild(tgt);
					group_column1.appendChild(tgt);
				};

			for (i=0; i< birdgroups.length; i++) {
				g = birdgroups[i];
				var grouphtml = `<a class='group'>${g}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = grouphtml;

				if (g == group) {
					liobject.addEventListener("click", click_group2);
					group_column2.appendChild(liobject);
				} else {
					liobject.addEventListener("click", click_group1);
					group_column1.appendChild(liobject);
				};
			};

			species_countries = [];
			country_column1.replaceChildren();
			country_column2.replaceChildren();

			var click_country1 = e => {
					var tgt = e.target.closest("li");
					tgt.removeEventListener("click", click_country1);
					tgt.addEventListener("click", click_country2);
					country_column1.removeChild(tgt);
					country_column2.appendChild(tgt);
					species_countries.push(tgt.innerText);
					commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${all_comments[species_index]}`;
				};

			var click_country2 = e => {
					var tgt = e.target.closest("li");
					n = country_column2.childElementCount;
					if (n >= 2) {
						tgt.removeEventListener("click", click_country2);
						tgt.addEventListener("click", click_country1);
						country_column2.removeChild(tgt);
						country_column1.appendChild(tgt);
						index = species_countries.indexOf(tgt.innerText);
						species_countries.splice(index, 1);
						commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${all_comments[species_index]}`;
					};
				};

			for (i=groups_index+1; i<comments_index; i++) {
				var h = headers[i];
				var countryhtml = `<a class='country'>${h}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = countryhtml;

				if (row[h] == 'TRUE') {
					species_countries.push(headers[i]);
					liobject.addEventListener("click", click_country2);
					country_column2.appendChild(liobject);

				} else {
					liobject.addEventListener("click", click_country1);
					country_column1.appendChild(liobject);
				};
			};
			
			if (row['Favourites'] == 'TRUE') {
				fav_checkbox.checked = true;
			} else {
				fav_checkbox.checked = false;
			};

			comments_input.value = all_comments[species_index];
			var comment_update = e => {
				commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
			};
			comments_select.addEventListener("click", comment_update);

			imagelink_input.value = all_imagelinks[species_index];
			var image = document.createElement("img");
			image.src = all_imagelinks[species_index];
			imagepane.replaceChildren();
			imagepane.appendChild(image);
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

			commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${all_comments[species_index]}`;
			commentspane.style.color = "lightslategray";
			commentspane.style.fontSize = "12px";

			var save = e => {

				if (group_column2.childNodes.length == 1) {
					group = group_column2.childNodes[0].innerText;
				} else {
					group = '';
				};

				bird_entry = {'species':select_species_input.value, 'bird_group':group};
				
				for (i=0; i<all_countries.length; i++) {
					country = all_countries[i];
					if (species_countries.includes(country)) {
						bird_entry[`${country}`] = 'TRUE';
					} else {
						bird_entry[`${country}`] = '';
					};
				};
				
				if (comments_input.value.length > 0) {
					bird_entry['Comments'] = comments_input.value;
				} else {
					bird_entry['Comments'] = '';
				};
				
				if (fav_checkbox.checked == true) {
					bird_entry['Favourites'] = 'TRUE';
				} else {
					bird_entry['Favourites'] = '';
				};

				if (imagelink_input.value.length > 0) {
					bird_entry['Image_link'] = imagelink_input.value;
				} else {
					bird_entry['Image_link'] = '';
				};
			};

			save_button.addEventListener("click", save);
			
			
		} else {
			
			group_column2.replaceChildren();
			group_column1.replaceChildren();
			country_column2.replaceChildren();
			country_column1.replaceChildren();
			species_countries = [];
			fav_checkbox.checked = false;
			comments_input.value = "";
			imagelink_input.value = "";
			imagepane.replaceChildren();
			commentspane.textContent = `${select_species_input.value}`;
			commentspane.style.color = "lightslategray";
			commentspane.style.fontSize = "12px";

			var click_group1 = e => {
					var tgt = e.target.closest("li");
					n = group_column2.childElementCount;
					if (n == 0) {
						tgt.removeEventListener("click", click_group1);
						tgt.addEventListener("click", click_group2);
						group_column1.removeChild(tgt);
						group_column2.appendChild(tgt);
					};
				};

			var click_group2 = e => {
					var tgt = e.target.closest("li");
					tgt.removeEventListener("click", click_group2);
					tgt.addEventListener("click", click_group1);
					group_column2.removeChild(tgt);
					group_column1.appendChild(tgt);
				};

			for (i=0; i< birdgroups.length; i++) {
				g = birdgroups[i];
				var grouphtml = `<a class='group'>${g}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = grouphtml;
				liobject.addEventListener("click", click_group1);
				group_column1.appendChild(liobject);
			};

			var click_country1 = e => {
				var tgt = e.target.closest("li");
				tgt.removeEventListener("click", click_country1);
				tgt.addEventListener("click", click_country2);
				country_column1.removeChild(tgt);
				country_column2.appendChild(tgt);
				species_countries.push(tgt.innerText);
				commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
			};

			var click_country2 = e => {
				var tgt = e.target.closest("li");
				n = country_column2.childElementCount;
				if (n >= 2) {
					tgt.removeEventListener("click", click_country2);
					tgt.addEventListener("click", click_country1);
					country_column2.removeChild(tgt);
					country_column1.appendChild(tgt);
					index = species_countries.indexOf(tgt.innerText);
					species_countries.splice(index, 1);
					commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
				};
			};

			for (i=0; i<all_countries.length; i++) {
				var c = all_countries[i];
				var countryhtml = `<a class='country'>${c}</a>`;
				var liobject = document.createElement("li");
				liobject.innerHTML = countryhtml;
				liobject.addEventListener("click", click_country1);
				country_column1.appendChild(liobject);
			};

			var comment_update = e => {
				commentspane.textContent = `${select_species_input.value}\n${species_countries}\n${comments_input.value}`;
			};
			comments_select.addEventListener("click", comment_update);
			
			var image = document.createElement("img");
			var img_update = e => {
				
				image.src = imagelink_input.value;
				imagepane.replaceChildren();
				imagepane.appendChild(image);
				image.style.maxWidth = "100%";
				image.style.maxHeight = "100%";
				image.style.height = "auto";
				image.style.display = "table";
				image.style.margin = "0 auto";
			};

			imagelink_select.addEventListener("click", img_update);
			
			var save = e => {

				if (group_column2.childNodes.length == 1) {
					group = group_column2.childNodes[0].innerText;
				} else {
					group = '';
				};

				bird_entry = {'species':select_species_input.value, 'bird_group':group};
				
				for (i=0; i<all_countries.length; i++) {
					country = all_countries[i];
					if (species_countries.includes(country)) {
						bird_entry[`${country}`] = 'TRUE';
					} else {
						bird_entry[`${country}`] = '';
					};
				};
				
				if (comments_input.value.length > 0) {
					bird_entry['Comments'] = comments_input.value;
				} else {
					bird_entry['Comments'] = '';
				};
				
				if (fav_checkbox.checked == true) {
					bird_entry['Favourites'] = 'TRUE';
				} else {
					bird_entry['Favourites'] = '';
				};

				if (imagelink_input.value.length > 0) {
					bird_entry['Image_link'] = imagelink_input.value;
				} else {
					bird_entry['Image_link'] = '';
				};
			};

			save_button.addEventListener("click", save);

		};

		





		
	};

	select_species_button.addEventListener("click", populate_fields);

};







