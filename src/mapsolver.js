"use strict";

var columnLimit = 0, rowLimit = 0, attractionBonus = 0, numLineBreaks = 0, timeDelay, remainingMice = 0;

String.prototype.capitalise = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    (
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"),
        "gi");


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\"");

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var pop = new XMLHttpRequest();
pop.open("get", "https://tsitu.github.io/MH-Tools/data/populations.csv", true);
pop.onreadystatechange = function() {
	if (pop.readyState == 4) {
		processPop();
	}
}
pop.send();

var baseline = new XMLHttpRequest();
baseline.open("get", "https://tsitu.github.io/MH-Tools/data/baselines.txt", true);
baseline.onreadystatechange = function() {
	if (baseline.readyState == 4) {
		//console.log(baseline.responseText);

		processBaseline(baseline.responseText);
	}
}
baseline.send();

var baselineArray = [];
function processBaseline(baselineText) {
	baselineArray = baselineText.split("\n");
	var baselineArrayLength = baselineArray.length;
	
	for (var i=0; i<baselineArrayLength; i++) {
		baselineArray[i] = baselineArray[i].split("\t");
		//console.log(baselineArray[i][0]);
		baselineArray[baselineArray[i][0]] = parseFloat(baselineArray[i][1]);
	}
}

var popCSV = new Array();
var popArray = new Array();
function processPop() {
	var popText = pop.responseText;

	popCSV = CSVToArray(popText);
	//console.log(popCSV);
	var popCSVLength = Object.size(popCSV);
	//console.log(popCSVLength);
		
	//Creating popArray
	for(var i=1; i<popCSVLength; i++) {
		var row = popCSV[i];
		var location = row[0];
		var phase = row[1];
		var cheese = row[2];
		var charm = row[3];
		var mouseName = row[5];
		mouseName = mouseName.capitalise();
		var population = row[4];

		if (popArray[mouseName] == undefined) popArray[mouseName] = new Array(); //If mouse doesn't exist in array
		if (popArray[mouseName][location] == undefined) popArray[mouseName][location] = new Array();
		if (popArray[mouseName][location][phase] == undefined) popArray[mouseName][location][phase] = new Array();
		if (popArray[mouseName][location][phase][cheese] == undefined) popArray[mouseName][location][phase][cheese] = new Array();
		popArray[mouseName][location][phase][cheese][charm] = population;
	}

	loadMouseDropdown();
}

function loadMouseDropdown() {
	var popArrayLength = Object.size(popArray);
	var suggests = [];

	for (var i=0; i<popArrayLength; i++) {
		suggests.push(Object.keys(popArray)[i]);
		suggests.push(Object.keys(popArray)[i].toLowerCase());
	}
	
	$("#map").asuggest(suggests);

} 

window.onload = function () {

	$("#map").keyup(function(event) {
		// Checking for enter/return, backspace, and delete
		// Then finding newlines and only processing when that differs from previous value
		if (event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 46) {
			clearTimeout(timeDelay);
			var mapText = document.getElementById("map").value;
			var b = (mapText.match(/\n/g)||[]).length;
			if (b != numLineBreaks) {
				numLineBreaks = b;
				processMap(mapText);
			}
			else {
				clearTimeout(timeDelay);
				var mapText = document.getElementById("map").value;
				timeDelay = setTimeout(function() { processMap(mapText); }, 1000);
			}
		}
		else {
			// 1-second delay after every keypress before processing map
			// Implicitly handles pasting
			clearTimeout(timeDelay);
			var mapText = document.getElementById("map").value;
			timeDelay = setTimeout(function() { processMap(mapText); }, 1000);
		}
	});

	$("input[name='colLimit']").change(function() {
		columnLimit = $(this).val();
		var mapText = document.getElementById("map").value;
		processMap(mapText);
	});

	$("input[name='rowLimit']").change(function() {
		rowLimit = $(this).val();
		var mapText = document.getElementById("map").value;
		processMap(mapText);
	});

	$.tablesorter.addParser({
    	id: "fancyNumber",
		is: function(s) {
		    return /^[0-9]?[0-9,\.]*$/.test(s);
		},
		format: function(s) {
		    return jQuery.tablesorter.formatFloat( s.replace(/,/g,'') );
		},
		type: "numeric"
	});
	
	$.tablesorter.defaults.sortInitialOrder = 'desc';
}

function processMap(mapText) {
	var mouseArray = mapText.split("\n");
	var mouseArrayLength = Object.size(mouseArray);
	
	var interpretedAs = document.getElementById("interpretedAs");
	var mouseList = document.getElementById("mouseList");

	var interpretedAsText = "<b>Invalid:<br></b><span class='invalid'>";
	var mouseListText = '';
	
	var bestLocationArray = new Array();
	var weightedBLA = new Array();
	var mouseLocationArray = new Array();
	var seenMice = new Array();
	remainingMice = 0;
	
	for (var i=0; i<mouseArrayLength; i++) {
		var mouseName = mouseArray[i];
		if (mouseName.length == 0) continue;
		mouseName = mouseName.capitalise();
		mouseName = mouseName.trim();
		var indexOfMouse = mouseName.indexOf(" Mouse");
		if (indexOfMouse >= 0) {
			mouseName = mouseName.slice(0,indexOfMouse);
		}
		
		if (popArray[mouseName] == undefined) { //Mouse name not recognised
			interpretedAsText += mouseName + "<br>";
		}
		else {			
			if (seenMice.indexOf(mouseName) >= 0) {
				continue;
			}
			else {
				seenMice.push(mouseName);
			}

			var mouseLocationCheese = new Array();
			
			mouseListText += "<tr><td style='font-size: 12px; padding: 10px'><b>" + mouseName + "</b></td>";
			remainingMice++;

			var mouseLocation = Object.keys(popArray[mouseName]);
			var noLocations = Object.size(popArray[mouseName]); //console.log(noLocations);

			for (var j=0; j<noLocations; j++) {
				var locationName = mouseLocation[j];
				
				var mousePhase = Object.keys(popArray[mouseName][locationName]);
				var noPhases = Object.size(popArray[mouseName][locationName]);
				
				for (var k=0; k<noPhases; k++) {
					var phaseName = mousePhase[k];

					var mouseCheese = Object.keys(popArray[mouseName][locationName][phaseName]);
					var noCheeses = Object.size(popArray[mouseName][locationName][phaseName]);

					for (var l=0; l<noCheeses; l++) {
						var cheeseName = mouseCheese[l];

						var mouseCharm = Object.keys(popArray[mouseName][locationName][phaseName][cheeseName]);
						var noCharms = Object.size(popArray[mouseName][locationName][phaseName][cheeseName]);

						for (var m=0; m<noCharms; m++) {
							var charmName = mouseCharm[m]

							var locationPhaseCheeseCharm = "<b>" + locationName + "</b><br>";
							
							var URLString = 'setup.html?';
							//Replace apostrophes with %27
							URLString += "location=" + locationName;

							if (phaseName != "-") {
								locationPhaseCheeseCharm += "(" + phaseName + ")" + "<br>";
								URLString += "&phase=" + phaseName;
							}

							if (cheeseName.indexOf("/") > 0) {
								var trimmedCheese = cheeseName.slice(0, cheeseName.indexOf("/"));
								URLString += "&cheese=" + trimmedCheese;
								var restCheese = cheeseName.slice(cheeseName.indexOf("/"), cheeseName.length+1);
								locationPhaseCheeseCharm += "<ins>" + trimmedCheese + "</ins>" + restCheese + "<br>";
							}
							else {
								URLString += "&cheese=" + cheeseName;
								locationPhaseCheeseCharm += cheeseName + "<br>";
							}

							if (charmName != "-") {
								locationPhaseCheeseCharm += "[" + charmName + "]" + "<br>";
							}

							var modURLString = URLString.replace(/ /g, "%20");
							locationPhaseCheeseCharm += "<a href=" + modURLString + " target=\"_blank\">Link to best setup</a>";
							
							var attractionRate = parseFloat(popArray[mouseName][locationName][phaseName][cheeseName][charmName]);

							//Populate mouse location array
							if (mouseLocationArray[locationPhaseCheeseCharm] == undefined) {
								mouseLocationArray[locationPhaseCheeseCharm] = [];
							}
							mouseLocationArray[locationPhaseCheeseCharm].push([mouseName, attractionRate]);

							if (bestLocationArray[locationPhaseCheeseCharm] == undefined) {
								bestLocationArray[locationPhaseCheeseCharm] = attractionRate;
								if (cheeseName.indexOf("/") > 0) {
									var trimmedCheese = cheeseName.slice(0, cheeseName.indexOf("/"));
									var baseline = findBaseline(locationName, trimmedCheese);
									weightedBLA[locationPhaseCheeseCharm] = attractionRate * (baseline + attractionBonus/100 - attractionBonus/100*baseline);
								}
								else {
									var baseline = findBaseline(locationName, cheeseName);
									weightedBLA[locationPhaseCheeseCharm] = attractionRate * (baseline + attractionBonus/100 - attractionBonus/100*baseline);
								}
							} 
							else {
								bestLocationArray[locationPhaseCheeseCharm] += attractionRate;
								if (cheeseName.indexOf("/") > 0) {
									var trimmedCheese = cheeseName.slice(0, cheeseName.indexOf("/"));
									var baseline = findBaseline(locationName, trimmedCheese);
									weightedBLA[locationPhaseCheeseCharm] += attractionRate * (baseline + attractionBonus/100 - attractionBonus/100*baseline);
								}
								else {
									var baseline = findBaseline(locationName, cheeseName);
									weightedBLA[locationPhaseCheeseCharm] += attractionRate * (baseline + attractionBonus/100 - attractionBonus/100*baseline);
								}
							}
							
							mouseLocationCheese[locationPhaseCheeseCharm] = attractionRate;
						}
					}
				}
			}
			
			var sortedMLC = sortBestLocation (mouseLocationCheese); //console.log(sortedMLC);
			var sortedMLCLength = Object.size(sortedMLC);

			//Mouse list column constraints
			if (columnLimit != 0) {
				if (sortedMLCLength > columnLimit) {
					sortedMLCLength = columnLimit;
				}
			}
			
			for (var l=0; l<sortedMLCLength; l++) {
				var sliceMLC = sortedMLC[l][0].slice(0, sortedMLC[l][0].indexOf("<a href"));
				mouseListText += "<td style=\'font-size: 10px; white-space: nowrap; padding: 10px\'>" + sliceMLC + "<br>" + sortedMLC[l][1] + "%</td>";
			}
			
			mouseListText += "</tr>";
		}
	}
	
	interpretedAsText += "</span>";
	interpretedAs.innerHTML = interpretedAsText;
	mouseList.innerHTML = mouseListText;
	$("#remainValue").text(remainingMice);

	//Sort mouseLocationArray
	for (var lpcc in mouseLocationArray) {
		if (mouseLocationArray.hasOwnProperty(lpcc)) {
			mouseLocationArray[lpcc].sort(function(a,b) {return b[1]-a[1]});
		}
	}

	var sortedLocation = sortBestLocation (bestLocationArray, weightedBLA);
	printBestLocation(sortedLocation, mouseLocationArray);
}

function sortBestLocation (bestLocationArray, weightedBLA) {

	var sortedLocation = new Array();
	
	var bLALength = Object.size(bestLocationArray);
	var bLAKeys = Object.keys(bestLocationArray);
	
	if (typeof weightedBLA != 'undefined') {
		for (var i=0; i<bLALength; i++) {
			var locationCheese = bLAKeys[i];
			//sortedLocation[bestLocationArray[locationCheese]] = locationCheese;
			sortedLocation.push([locationCheese, bestLocationArray[locationCheese], weightedBLA[locationCheese]]);
		}
		
		sortedLocation.sort(function(a,b) {return b[2]-a[2]});
	}
	else {
		for (var i=0; i<bLALength; i++) {
			var locationCheese = bLAKeys[i];
			//sortedLocation[bestLocationArray[locationCheese]] = locationCheese;
			sortedLocation.push([locationCheese, bestLocationArray[locationCheese]]);
		}

		sortedLocation.sort(function(a,b) {return b[1]-a[1]});
	}
	
	return sortedLocation;
}

function printBestLocation (sortedLocation, mouseLocationArray) {

	var bestLocation = document.getElementById("bestLocation");
	var bestLocationHTML = '<thead><tr><th align=\'center\'>Location Info</th><th align=\'center\'>Mice</th><th align=\'center\'>Raw AR</th><th align=\'center\' id=\'weightAR\'>Weighted AR</th></thead><tbody>';
	
	var sortedLocationLength = Object.size(sortedLocation);

	//Best location row constraints
	if (rowLimit != 0) {
		if (sortedLocationLength > rowLimit) {
			sortedLocationLength = rowLimit;
		}
	}
	
	for (var i=0; i<sortedLocationLength; i++) {
		//Checking mouse location
		var mouseLocationHTML = '';
		var lpcc = sortedLocation[i][0];
		if (mouseLocationArray[lpcc] != undefined) {
			for (var j=0; j<Object.size(mouseLocationArray[lpcc]); j++) {
				mouseLocationHTML += mouseLocationArray[lpcc][j][0] + " (" + mouseLocationArray[lpcc][j][1] + "%)<br>";
			}
		}
		else {
			mouseLocationHTML = 'N/A';
		}

		bestLocationHTML += "<tr><td align=\'center\' style=\'white-space: nowrap\'>" + sortedLocation[i][0] + "</td><td align=\'center\' style=\'font-size: 11px; white-space: nowrap\'>" + mouseLocationHTML + "</td><td align=\'center\'>" + sortedLocation[i][1].toFixed(2) + "%</td><td align=\'center\'>" + sortedLocation[i][2].toFixed(2) + "%</td></tr>";
	}
	
	bestLocationHTML += "</tbody>";
	bestLocation.innerHTML = bestLocationHTML;
	
	$("#bestLocation").tablesorter();
	$("#weightAR").click();
}

function findBaseline(location, cheese) {
	//TODO make common cheese ar be global
	var baselineAtt = baselineAttArray[cheese];
	if (baselineAtt == undefined) {
		baselineAtt = baselineArray[location + " (" + cheese + ")"];
	}
	return baselineAtt;
}