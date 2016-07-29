"use strict";

var columnLimit = 0, rowLimit = 0, attractionBonus = 0, numLineBreaks = 0, timeDelay, remainingMice = 0;

window.onload = function () {

	//Bookmarklet storage logic
	if (mapBookmarkletString != localStorage.getItem('mapBookmarklet')) {
		alert("Bookmarklet has changed! Please update accordingly.");
		localStorage.setItem('mapBookmarklet', mapBookmarkletString);
	}
    $("#bookmarklet").attr("href", mapBookmarkletString);

	//Initialize tablesorter, bind to table
	$.tablesorter.defaults.sortInitialOrder = 'desc';
    $("#bestLocation").tablesorter({
		// sortForce: [[noMice,1]],
		sortReset: true,
		widthFixed: true,
		ignoreCase: false,
		widgets: ["filter"],
		widgetOptions: {
			filter_childRows : false,
			filter_childByColumn : false,
			filter_childWithSibs : true,
			filter_columnFilters : true,
			filter_columnAnyMatch: true,
			filter_cellFilter : '',
			filter_cssFilter : '', // or []
			filter_defaultFilter : {},
			filter_excludeFilter : {},
			filter_external : '',
			filter_filteredRow : 'filtered',
			filter_formatter : null,
			filter_functions : null,
			filter_hideEmpty : true,
			filter_hideFilters : true,
			filter_ignoreCase : true,
			filter_liveSearch : true,
			filter_matchType : { 'input': 'exact', 'select': 'exact' },
			filter_onlyAvail : 'filter-onlyAvail',
			filter_placeholder : { search : 'Filter results...', select : '' },
			filter_reset : 'button.reset',
			filter_resetOnEsc : true,
			filter_saveFilters : false,
			filter_searchDelay : 420,
			filter_searchFiltered: true,
			filter_selectSource  : null,
			filter_serversideFiltering : false,
			filter_startsWith : false,
			filter_useParsedData : false,
			filter_defaultAttrib : 'data-value',
			filter_selectSourceSeparator : '|',
		}
	});

	$("#mouseList").tablesorter({
		// sortForce: [[noMice,1]],
		sortReset: true,
		widthFixed: true,
		ignoreCase: false,
		widgets: ["filter"],
		widgetOptions: {
			filter_childRows : false,
			filter_childByColumn : false,
			filter_childWithSibs : true,
			filter_columnFilters : true,
			filter_columnAnyMatch: true,
			filter_cellFilter : '',
			filter_cssFilter : '', // or []
			filter_defaultFilter : {},
			filter_excludeFilter : {},
			filter_external : '',
			filter_filteredRow : 'filtered',
			filter_formatter : null,
			filter_functions : null,
			filter_hideEmpty : true,
			filter_hideFilters : true,
			filter_ignoreCase : true,
			filter_liveSearch : true,
			filter_matchType : { 'input': 'exact', 'select': 'exact' },
			filter_onlyAvail : 'filter-onlyAvail',
			filter_placeholder : { search : 'Filter results...', select : '' },
			filter_reset : 'button.reset',
			filter_resetOnEsc : true,
			filter_saveFilters : false,
			filter_searchDelay : 420,
			filter_searchFiltered: true,
			filter_selectSource  : null,
			filter_serversideFiltering : false,
			filter_startsWith : false,
			filter_useParsedData : false,
			filter_defaultAttrib : 'data-value',
			filter_selectSourceSeparator : '|',
		}
	});

	var mouseList = getMouseListFromURL(window.location.search.match(/mice=([^&]*)/));

	//Row/column cookies
    if (Cookies.get('savedRows') !== undefined) {
    	var x = parseInt(Cookies.get('savedRows'));
    	var s = "#row" + x;
    	$(s).prop('checked', true);
    	rowLimit = x;
    }
    if (Cookies.get('savedCols') !== undefined) {
    	var x = parseInt(Cookies.get('savedCols'));
    	var s = "#col" + x;
    	$(s).prop('checked', true);
    	columnLimit = x;
    }

    if (Cookies.get('savedAttraction') !== undefined) {
    	var x = parseInt(Cookies.get('savedAttraction'));
    	attractionBonus = x;
    	$("#ampSlider").slider('option','value',attractionBonus);
    }

    if (mouseList.length === 0) {
        var cookie = Cookies.get('savedMice');
        if (cookie !== undefined) {
            $('#map').val(Cookies.get('savedMice'));
            var mapText = document.getElementById("map").value;
            setTimeout(function() { processMap(mapText); }, 100);
            $("#weightAR").click();
        }
    } else {
        $('#map').val(mouseList);
        var mapText = document.getElementById("map").value;
        setTimeout(function() { processMap(mapText); }, 100);
        $("#weightAR").click();
    }

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
		Cookies.set('savedCols', columnLimit, {
	        expires: 30
	    });
		var mapText = document.getElementById("map").value;
		processMap(mapText);
	});

	$("input[name='rowLimit']").change(function() {
		rowLimit = $(this).val();
		Cookies.set('savedRows', rowLimit, {
	        expires: 30
	    });
		var mapText = document.getElementById("map").value;
		processMap(mapText);
	});
}

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

function processMap(mapText) {
	//Save a cookie
	Cookies.set('savedMice', mapText, {
        expires: 14
    });

	var mouseArray = mapText.split("\n");
	var mouseArrayLength = Object.size(mouseArray);
	
	var interpretedAs = document.getElementById("interpretedAs");
	var mouseList = document.getElementById("mouseList");

	var interpretedAsText = "<b>Invalid:<br></b><span class='invalid'>";
	var mouseListText = '<thead><tr><th align=\'center\'>Mouse</th><th align=\'center\' id=\'locationAR\'>Location (Raw AR)</th></tr></thead><tbody>';
	
	var bestLocationArray = new Array();
	var weightedBLA = new Array();
	var mouseLocationArray = new Array();
	var seenMice = new Array();
	var notRecognized = false;
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
			notRecognized = true;
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
				mouseListText += "<td style=\'font-size: 11px; padding: 10px\'>" + "<p style='font-size: 16px'>" + sortedMLC[l][1] + "%</p><br>" + sliceMLC + "</td>";
			}
		}
	}

	mouseListText += "</tbody>";
	mouseList.innerHTML = mouseListText;
	var resort = true, callback = function() {
    	var header = $("#locationAR");
    	if (header.hasClass("tablesorter-headerAsc")) {
    		header.click();
    		header.click();
    	}
    	else if (header.hasClass("tablesorter-headerUnSorted")) {
    		header.click();
    	}
    };
	$("#mouseList").trigger("updateAll", [ resort, callback ]);
	
	interpretedAsText += "</span>";
	interpretedAs.innerHTML = interpretedAsText;
	if (notRecognized) {
		$("#interpretedAs").show(500);
	}
	else {
		$("#interpretedAs").hide(500);
	}

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
	var bestLocationHTML = '<thead><tr><th align=\'center\'>Location Info</th><th align=\'center\'>Mice (Raw AR)</th><th align=\'center\' data-filter=\'false\'>Total AR</th><th align=\'center\' id=\'weightAR\' data-filter=\'false\'>Weighted AR</th></tr></thead><tbody>';
	
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

		bestLocationHTML += "<tr><td align=\'center\'>" + sortedLocation[i][0] + "</td><td align=\'center\' style=\'font-size: 11px; white-space: nowrap\'>" + mouseLocationHTML + "</td><td align=\'center\'>" + sortedLocation[i][1].toFixed(2) + "%</td><td align=\'center\'>" + sortedLocation[i][2].toFixed(2) + "%</td></tr>";
	}
	
	bestLocationHTML += "</tbody>";
	bestLocation.innerHTML = bestLocationHTML;
	
	var resort = true, callback = function() {
    	var header = $("#weightAR");
    	if (header.hasClass("tablesorter-headerAsc")) {
    		header.click();
    		header.click();
    	}
    	else if (header.hasClass("tablesorter-headerUnSorted")) {
    		header.click();
    	}
    };
	$("#bestLocation").trigger("updateAll", [ resort, callback ]);
}

function findBaseline(location, cheese) {
	//TODO make common cheese ar be global
	var baselineAtt = baselineAttArray[cheese];
	if (baselineAtt == undefined) {
		baselineAtt = baselineArray[location + " (" + cheese + ")"];
	}
	return baselineAtt;
}

function getMouseListFromURL(parameters) {
    if (parameters) {
        parameters = decodeURI(parameters[1]);

        return parameters
            .split('/')
            .join('\n');
    } else {
        return [];
    }
}