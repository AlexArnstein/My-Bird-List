
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

	  document.getElementById("main-content").style.height = "500px";
	  document.getElementById("world-map").style.width = "100%";
 		document.getElementById("world-map").style.height = "100%";

	  document.addEventListener("keyup", function (){
	  	var key = event.keyCode;
	  	if (key == 27) {
	  		window.location="totals.html";
	  	}
	  });
	  
	});
};

$(document).ready(function() {
    makemap();
});
