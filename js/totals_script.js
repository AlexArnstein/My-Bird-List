
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

function makemap (callback) {
	loadfile(function(data){
		var columns = data[0];
		var rows = data[1];
		groupindex = rows[0].indexOf("Group");
		commentsindex = rows[0].indexOf("Comments");
		countries = rows[0].slice(groupindex+1, commentsindex);
		
		mapdata = [
			['Country', 'Bird Species'],
			['',0]
			];
		
		for (i=groupindex+1; i<commentsindex; i++){
			countrytotal = columns[i].filter(Boolean).length - 1;
			mapdata.push([countries[i-groupindex-1], countrytotal]);
		}

		google.charts.load('current', {
    'packages':['geochart'],
  	});
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

	  UKindex = rows[0].indexOf("United Kingdom");
	  UKbirdcount = columns[UKindex].filter(Boolean).length -1;
	  totalbirdcount = columns[0].filter(Boolean).length -1;
	  abroadbirdcount = totalbirdcount - UKbirdcount;
	  BTOukbirds = 630;
	  birdsremaining = BTOukbirds - UKbirdcount;

	  piedata1 = [
	  	['Seen and Remaining','Number of Species'],
	  	["UK Bird Species I've seen", UKbirdcount],
	  	["Remaining birds on BTO UK Bird List", birdsremaining]
	  	];

	  google.charts.load('current', {
    'packages':['corechart'],
  	});
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


    groupcolindex = rows[0].indexOf("Group");
    groupColumn = columns[groupcolindex].slice(1, columns[0].length);
    groups = [...new Set(groupColumn)];
    emptyindex = groups.indexOf("");
    groups.splice(emptyindex,1);
    group_counts = [];
    
    function elementCount(arr, element){
    	return arr.filter((currentElement) => currentElement == element).length;
    };

    for (i=0;i<groups.length;i++){
    	group_counts.push(elementCount(groupColumn, groups[i]))
    };

    console.log(group_counts);

	  bardata = [
	  	// ['Bird Group','Number of Species Seen']
	  	];

	  for (i=0; i<groups.length;i++){
	  	bardata.push([groups[i],group_counts[i]])
	  };

	  bardata.sort((a,b) =>b[1]-a[1]);

	  bardata.unshift(["Bird Group","Number of Species Seen"]);

	  google.charts.load('current', {
    'packages':['corechart'],
  	});
	  google.charts.setOnLoadCallback(drawBar);

	  function drawBar() {
        var bardatatable = google.visualization.arrayToDataTable(bardata);

        var options = {
        	legend: "none",
        	title: "Bird group counts",
        	hAxis: {textPosition: "none"}
        };

        var barChart = new google.visualization.ColumnChart(document.getElementById('Group count'));

        barChart.draw(bardatatable, options);
      };
	});
};

$(document).ready(function() {
    makemap();
});
