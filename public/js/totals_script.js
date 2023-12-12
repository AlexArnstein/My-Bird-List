
//  load data ----------------------------------

fetch('/api/table')
		.then(response => response.json())
		.then(table => {
			headers = table[0];
			data = table[1];

			makemap(headers, data);

			});
		

// create graphs --------------------------------

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

  leftcharts = document.getElementById("chart_select");

  var showchart = e => {
  	chart_clicked = e.target.textContent;
  	for (i=0; i<leftcharts.children.length; i++){
  		if (chart_clicked == leftcharts.children[i].innerText) {
  			chartshow = document.getElementById(leftcharts.children[i].innerText);
  			chartshow.style.display = "";
  		}
  		else {
  			charthide= document.getElementById(leftcharts.children[i].innerText);
  			charthide.style.display = "none";
  		};
  	};
  };

  for (i=0; i<leftcharts.children.length; i++){
	leftcharts.children[i].addEventListener("click", showchart);
	};

	ukcol = data.map(function(value, index) { return value["United_Kingdom"];});
  UKbirdcount = ukcol.filter(Boolean).length;
  totalbirdcount = data.length;
  abroadbirdcount = totalbirdcount - UKbirdcount;
  BTOukbirds = 630;
  birdsremaining = BTOukbirds - UKbirdcount;

  piedata1 = [
  	['Seen and Remaining','Number of Species'],
  	["UK Bird Species I've seen", UKbirdcount],
  	["Remaining birds on BTO UK Bird List", birdsremaining]
  	];

  google.charts.load('current', {'packages':['corechart'],});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
    var piedatatable1 = google.visualization.arrayToDataTable(piedata1);

    var options = {
      title: `My UK Bird Count = ${UKbirdcount} species`
    };

    var piechart1 = new google.visualization.PieChart(document.getElementById('UK count'));

    piechart1.draw(piedatatable1, options);
  };

  piedata2 = [
	  	['Location','Number of Species'],
	  	['Bird Species Seen in UK', UKbirdcount],
	  	['Bird Species Seen Abroad', abroadbirdcount]
	  	];

  google.charts.load('current', {
  'packages':['corechart'],
	});
  google.charts.setOnLoadCallback(drawChart2);

  function drawChart2() {
    var piedatatable2 = google.visualization.arrayToDataTable(piedata2);

    var options = {
      title: `My Global Bird Count = ${totalbirdcount} species`
    };

    var piechart2 = new google.visualization.PieChart(document.getElementById('Global count'));

    piechart2.draw(piedatatable2, options);
  };

	var group_col = data.map(function(value, index) { return value['bird_group'];});
	var birdgroups = [...new Set(group_col)];
	emptyindex = birdgroups.indexOf("");
	birdgroups.splice(emptyindex, 1);
  group_counts = [];
    
  function elementCount(arr, element){
  	return arr.filter((currentElement) => currentElement == element).length;
  };

  for (i=0;i<birdgroups.length;i++){
  	group_counts.push(elementCount(group_col, birdgroups[i]));
  };

  bardata = [
  	['Bird Group','Number of Species Seen']
  	];

  for (i=0; i<birdgroups.length;i++){
  	bardata.push([birdgroups[i],group_counts[i]])
  };

  bardata.sort((a,b) =>b[1]-a[1]);

  google.charts.load('current', {
  'packages':['corechart'],
	});
  google.charts.setOnLoadCallback(drawBar);

  function drawBar() {
  	var bardatatable = google.visualization.arrayToDataTable(bardata);

  	var options = {legend:"none", title:"Bird group counts", hAxis:{textPosition:"none"}};

  	var barChart = new google.visualization.ColumnChart(document.getElementById('Group count'));
  	barChart.draw(bardatatable, options);
  };
};