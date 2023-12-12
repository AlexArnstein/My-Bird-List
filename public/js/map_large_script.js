
//  load data ----------------------------------

fetch('/api/table')
		.then(response => response.json())
		.then(table => {
			headers = table[0];
			data = table[1];

			makemap(headers, data);

			});
		

// create graph --------------------------------

function makemap(headers, data) {
	
	mapdata = [
		['Country', 'Bird Species'],
		['',0]
		];
	
	var countries = headers.slice(headers.indexOf("United_Kingdom"), headers.indexOf("Comments"));

	for (i=0; i<countries.length; i++){
		var country = countries[i];
		var country_col = data.map(function(value, index) { return value[country];});
		countrytotal = country_col.filter(Boolean).length;

		if (country.includes("_")) {
			country = country.replace("_", " ");
		};

		mapdata.push([country, countrytotal]);
	};

	google.charts.load('current', {'packages':['geochart']});

	google.charts.setOnLoadCallback(drawRegionsMap);

	function drawRegionsMap() {
    var mapdatatable = google.visualization.arrayToDataTable(mapdata);
    var options = {};
    var chart = new google.visualization.GeoChart(document.getElementById('world-map'));
    chart.draw(mapdatatable, options);
	};

	document.getElementById('world-map').addEventListener("click", function(){window.location="map_large.html"});

 	document.getElementById("main-content").style.height = "500px";
  	document.getElementById("world-map").style.width = "100%";
	document.getElementById("world-map").style.height = "100%";

  	document.addEventListener("keyup", function (){
  		var key = event.keyCode;
	  	if (key == 27) {
	  		window.location="totals.html";
	  	}
	  });
};
