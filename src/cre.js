"use strict";

/*
 * Variable Initialization
 */
var popLoaded = 0, baselineLoaded = 0;
var weaponPower = 0, weaponBonus = 0, weaponLuck = 0, weaponAtt = 0, weaponEff = 0;
var basePower = 0, baseBonus = 0, baseLuck = 0, baseAtt = 0, baseEff = 0;
var charmPower = 0, charmBonus = 0, charmAtt = 0, charmLuck = 0, charmEff = 0;
var gsLuck = 7, lbwLuck = 0, pourBonus = 0, pourLuck = 0, isToxic = '', batteryPower = 0, lanternStatus = '';
var trapPower = 0, trapLuck = 0, trapType = '', trapAtt = 0, trapEff = 0;
var baseName = '', charmName = '', locationName = '', cheeseName = '', tournamentName = '', weaponName = '', phaseName = '';
var cheeseCost = 0, cheeseBonus = 0;
var cheeseLoaded = 0, charmLoaded = 0;
var sampleSize = 0, sizeDescriptor = '';

// Special charms
var specialCharm = [];
specialCharm["Champion Charm"] = 1;
specialCharm["Growth Charm"] = 1;
specialCharm["Spellbook Charm"] = 1;
specialCharm["Wild Growth Charm"] = 1;
specialCharm["Golden Tournament Base"] = 1;
specialCharm["Soiled Base"] = 1;
specialCharm["Spellbook Base"] = 1;

// Turning CSV into usable array with the format location->phase->cheese->charm->mouse->attraction rate
var popCSV = [];
var popArray = [];
var pop = new XMLHttpRequest();
var baseline = new XMLHttpRequest();

window.onload = function () {

	// if (location.href.indexOf("https") < 0) {
	// 	var currLoc = location.href;
	// 	currLoc = currLoc.replace("http", "https");
	// 	location.href = currLoc;
	// }

	//Instructions
	$("#instructions").click(function() {
		var instructionString = "Drag the blue 'CRE' link to your bookmarks bar if possible. If that doesn't work, try the manual steps below.\n\n";
		instructionString += "Google Chrome:\n- Bookmark a random page and name it 'CRE'"
		instructionString += "\n- Copy the bookmarklet code by right-clicking the 'CRE' link and selecting 'Copy link address...'"
		instructionString += "\n- Right click the newly created bookmark and select 'Edit...'"
		instructionString += "\n- Paste into the 'URL' field\n\n";
		instructionString += "Firefox:\n- Right click the 'CRE' link and select 'Bookmark This Link'\n\n";
		instructionString += "Internet Explorer:\n- Right click the 'CRE' link and select 'Add to favorites...'\n\n";
		instructionString += "Mobile/Other Browsers:\n- Same concept as above. Processes may vary";
		alert(instructionString);
	});

	//Bookmarklet storage logic
	if (creBookmarkletString != localStorage.getItem('creBookmarklet')) {
		alert("Bookmarklet has changed! Please update accordingly.");
		localStorage.setItem('creBookmarklet', creBookmarkletString);
	}
    $("#bookmarklet").attr("href", creBookmarkletString);

	//Initialize tablesorter, bind to table
    $("#results").tablesorter({
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

	pop.open("get", "https://tsitu.github.io/MH-Tools/data/populations.csv", true);
	// Local testing
	// http-server -p 8888 --cors 
	// (installed using "npm install http-server -g")
	// pop.open("get", "http://localhost:8888/testing/populationstest.csv", false);
	pop.onreadystatechange = function() {
		if (pop.readyState == 4) {
			//console.log(pop.responseText);
			processPop();
		}
	}
	pop.send();


	baseline.open("get", "https://tsitu.github.io/MH-Tools/data/baselines.txt", true);
	baseline.onreadystatechange = function() {
		if (baseline.readyState == 4) {
			//console.log(baseline.responseText);

			processBaseline(baseline.responseText);
		}
	}
	baseline.send();


	loadWeaponDropdown();
	loadBaseDropdown();
	loadCharmDropdown();

	var gsParameter = getURLParameter("gs");
	if (gsParameter != "null") {
		gsParameter = "No";
		var select = document.getElementById("gs");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == gsParameter) {
				child.selected = true;
		    	gsChanged();
				break;
			}
		}
	}
	
	var lbwParameter = getURLParameter("lbw");
	if (lbwParameter != "null") {
		lbwParameter = "Yes";
		var select = document.getElementById("lbw");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == lbwParameter) {
				child.selected = true;
		    	lbwChanged();
				break;
			}
		}
	}

    //Listening for changes in dropdowns or textboxes
    document.getElementById("location").onchange = function () {
		locationChanged();
    };
	
    document.getElementById("phase").onchange = function () {
		phaseChanged();
    };

    document.getElementById("cheese").onchange = function () {
		cheeseChanged();
    };

    document.getElementById("lanternOil").onchange = function () {
		oilChanged();
    };

    document.getElementById("toxic").onchange = function () {
		toxicChanged();
    };

    document.getElementById("battery").onchange = function () {
		batteryChanged();
    };

    document.getElementById("weapon").onchange = function () {
    	weaponChanged();
    };
    
    document.getElementById("base").onchange = function () {
		baseChanged();
    };

    document.getElementById("charm").onchange = function () {
		charmChanged();
    };

    document.getElementById("gs").onchange = function () {
		gsChanged();
	}
	
    document.getElementById("lbw").onchange = function () {
		lbwChanged();
	}
	
    document.getElementById("tourney").onchange = function () {
		tourneyChanged();
    };

    document.getElementById("cheeseCost").onchange = function () {
        cheeseCost = parseInt(document.getElementById("cheeseCost").value);
        //showPop();
        showPop(2);
    };

	//Send to google analytics that link to setup was clicked
    document.getElementById("link").onclick = function () {
		ga('send', 'event', 'setup link', 'click');
    }

    /*Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
	    return size;
	};

	console.log("miceArray: " + Object.size(miceArray));*/
}

function loadWeaponDropdown() {
	var weaponDropdown = document.getElementById("weapon");
	var weaponDropdownHTML = '<option></option>';

	var weaponsArrayLength = Object.size(weaponsArray);

	for (var i=0; i<weaponsArrayLength; i++) {
		weaponDropdownHTML += "<option>"+Object.keys(weaponsArray)[i]+"</option>\n";
	}
	
	weaponDropdown.innerHTML = weaponDropdownHTML;

	var weaponParameter = getURLParameter("weapon");
	if(weaponParameter != "null") {
		var select = document.getElementById("weapon");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == weaponParameter) {
				child.selected = true;
		    	weaponChanged();
				break;
			}
		}
	}
}

function loadBaseDropdown() {
	var baseDropdown = document.getElementById("base");
	var baseDropdownHTML = '<option></option>';

	var basesArrayLength = Object.size(basesArray);

	for (var i=0; i<basesArrayLength; i++) {
		baseDropdownHTML += "<option>"+Object.keys(basesArray)[i]+"</option>\n";
	}
	
	baseDropdown.innerHTML = baseDropdownHTML;

	var baseParameter = getURLParameter("base");
	if(baseParameter != "null") {
		var select = document.getElementById("base");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == baseParameter) {
				child.selected = true;
		    	baseChanged();
				break;
			}
		}
	}
}

function loadCharmDropdown() {
	var charmDropdown = document.getElementById("charm");
	var charmDropdownHTML = '<option>No Charm</option>';

	var charmsArrayLength = Object.size(charmsArray);

	for (var i=0; i<charmsArrayLength; i++) {
		charmDropdownHTML += "<option>"+Object.keys(charmsArray)[i]+"</option>\n";
	}
	
	charmDropdown.innerHTML = charmDropdownHTML;

	var charmParameter = getURLParameter("charm");
	if(charmParameter != "null") {
		var select = document.getElementById("charm");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == charmParameter) {
				child.selected = true;
		    	charmChanged();
				break;
			}
		}
	}
}

function checkLoadState() {
	var loadPercentage = (popLoaded + baselineLoaded)/2*100;
	var status = document.getElementById("status")
	status.innerHTML = "<td>Loaded "+loadPercentage+"%...</td>";
	
	if(loadPercentage == 100) {
		loadLocationDropdown();
		loadTourneyDropdown();
		//updateLink();

		var oilParameter = getURLParameter("oil");
		if (oilParameter != "null") {
			var select = document.getElementById("lanternOil");
			for (var i=0; i<select.children.length; i++) {
				var child = select.children[i];
				if (child.innerHTML == oilParameter) {
					child.selected = true;
			    	oilChanged();
					break;
				}
			}
		}

		var toxicParameter = getURLParameter("toxic");
		if (toxicParameter != "null") {
			var select = document.getElementById("toxic");
			for (var i=0; i<select.children.length; i++) {
				var child = select.children[i];
				if (child.innerHTML == toxicParameter) {
					child.selected = true;
			    	toxicChanged();
					break;
				}
			}
		}

		var batteryParameter = getURLParameter("battery");
		if (batteryParameter != "null") {
			var select = document.getElementById("battery");
			for (var i=0; i<select.children.length; i++) {
				var child = select.children[i];
				if (child.innerHTML == batteryParameter) {
					child.selected = true;
			    	batteryChanged();
					break;
				}
			}
		}

		var amplifierParameter = parseInt(getURLParameter("amplifier"));
		if (amplifierParameter >= 0 && amplifierParameter <= 175) {
			$("#ampSlider").slider('option','value',amplifierParameter);
			var myColor = getColor(amplifierParameter);
            $("#ampSlider .ui-slider-range").css("background-color", myColor);
            $("#ampSlider .ui-state-default, .ui-widget-content .ui-state-default").css("background-color", myColor);
            $("#ampValue").val(amplifierParameter);
            ztAmp = amplifierParameter;
            calculateTrapSetup("cre");
		}
		
		status.innerHTML = "<td>All set!</td>";
		setTimeout(function() {status.innerHTML = '<td><br></td>'}, 3000);
	}
}

function processPop () {
	var popText = pop.responseText;

	popCSV = CSVToArray(popText);
	//console.log(popCSV);	
	
	var popCSVLength = Object.size(popCSV);
	//console.log("popCSVLength", popCSVLength);
	
	//Creating popArray
	for(var i=1; i<popCSVLength; i++) {
		if (popArray[popCSV[i][0]] == undefined) popArray[popCSV[i][0]] = [];
		if (popArray[popCSV[i][0]][popCSV[i][1]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]] = [];

		//Check for fuse constituents
		if (popCSV[i][2].indexOf("/") >= 0) {
			var sliced = popCSV[i][2].split("/");
			for (var j=0; j<sliced.length; j++) {
				if (popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]] = [];
				
				if (popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]] = [];

				//Assign AR to a specific location/phase/cheese/charm/mouse
				popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);
				
				//Assign sample size value to a specific location/phase/cheese/charm when available
				if (popCSV[i][6].length > 0) {
					popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]]["SampleSize"] = parseInt(popCSV[i][6]);
				}
			}
		}
		else {
			if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] = [];
		
			if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] = [];
		
			//Assign AR to a specific location/phase/cheese/charm/mouse
			popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);
			
			//Assign sample size value to a specific location/phase/cheese/charm when available
			if (popCSV[i][6].length > 0) {
				popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]]["SampleSize"] = parseInt(popCSV[i][6]);
			}
		}
	}

	//console.log(popArray);

	popLoaded = 1;
	checkLoadState();
}


var baselineArray = [];
function processBaseline(baselineText) {
	baselineArray = baselineText.split("\n");
	var baselineArrayLength = baselineArray.length;
	
	for (var i=0; i<baselineArrayLength; i++) {
		baselineArray[i] = baselineArray[i].split("\t");
		//console.log(baselineArray[i][0]);
		baselineArray[baselineArray[i][0]] = parseFloat(baselineArray[i][1]);
	}

	baselineLoaded = 1;
	checkLoadState();
	//console.log(baselineArray);
}

function showTrapSetup(type) {
	var trapSetup = document.getElementById("trapSetup");

	if (type == 0) trapSetup.innerHTML = "<tr><td></td></tr>";
	else {
		trapSetup.innerHTML = "<tr><td>Type</td><td>" + trapType + "<tr><td>Power</td><td>" + commafy(trapPower) + "</td></tr><tr><td>Luck</td><td>" + trapLuck + "</td></tr><tr><td>Attraction Bonus</td><td>" + trapAtt + "%</td></tr><tr><td>Cheese Effect</td><td>" + reverseParseFreshness[trapEff] + "</td></tr>";
	}
}

function showPop (type) { //type = 2 means don't reset charms
	var results = document.getElementById("results");
	var commonCheeseIndex;

	if (type != 0 && type != 2) charmName = "No Charm";

	if (locationName == '' || type == 0) {
		results.innerHTML = ''
	} else {
		//console.log(popArray[locationName][cheeseName]);
		// console.log("locationName: " + locationName + ", phaseName: " + phaseName + ", cheeseName: " + cheeseName);
		var popArrayLPC = popArray[locationName][phaseName][cheeseName];
		//console.log(popArrayLPC)
		
		//For common cheeses e.g. gouda, brie etc.
		if (popArrayLPC == undefined && cheeseName != "Cheese") {
			var popArrayL = popArray[locationName][phaseName];
			var popArrayLLength = Object.size(popArray[locationName][phaseName]);
			for (var i=0; i<popArrayLLength; i++) {
				if (Object.keys(popArrayL)[i].indexOf(cheeseName) >= 0 && Object.keys(popArrayL)[i].indexOf("/") >= 0) {
					commonCheeseIndex = Object.keys(popArrayL)[i];
					break;
				}
			}
			popArrayLPC = popArray[locationName][phaseName][commonCheeseIndex];
		}
		
		//Highlight special charms
		if (Object.size(popArrayLPC)>1) {
			//console.log("Location has special charms");
			var nSpecialCharms = Object.size(popArrayLPC);
			var specialCharmsList = [];
			for (var i=1; i<nSpecialCharms; i++) {
				//console.log("Special charm", Object.keys(popArrayLPC)[i]);
				specialCharmsList.push(Object.keys(popArrayLPC)[i]);
			}
			//console.log("Highlighting charms");
			if (type!=2) highlightSpecialCharms(specialCharmsList);
		}
		/*
		 * Allow pop with special charm(s) but without a "no charm" pop
		 */
		else if (popArrayLPC != null && Object.keys(popArrayLPC)[0] != "-") {
			sampleSize = 0;
			var nSpecialCharms = Object.size(popArrayLPC);
			var specialCharmsList = [];
			for (var i=0; i<nSpecialCharms; i++) {
				//console.log("Special charm", Object.keys(popArrayLPC)[i]);
				specialCharmsList.push(Object.keys(popArrayLPC)[i]);
			}
			//console.log("Highlighting charms");
			if (type!=2) highlightSpecialCharms(specialCharmsList);
		}
		else {
			if (type!=2) {
				console.log("Resetting charms");
				resetCharms();
			}
		}
		
		if (charmName.indexOf("*")>=0) {
			console.log("It's a special charm!");
			var popArrayLC = popArrayLPC[charmName.slice(0,-7)];
		}
		else {
			if (popArrayLPC != undefined) {
				popArrayLC = popArrayLPC['-'];
			}
		}
		
		//console.log(popArrayLC);
		
		var noMice = Object.size(popArrayLC);
		var resultsHTML = "<thead><tr align='left'><th align='left'>Mouse</th><th data-filter='false'>Attraction<br>Rate</th><th data-filter='false'>Catch<br>Rate</th><th data-filter='false'>Catches per<br>100 hunts</th><th data-filter='false'>Gold</th><th data-filter='false'>Points</th><th data-filter='false'>Tournament<br>Points</th><th data-filter='false'>Min.<br>Luck</th>";
		if (locationName.indexOf("Seasonal Garden") >= 0) {
			var deltaAmpOverall = 0;
			resultsHTML += "<th data-filter='false'>Amp %</th>";
		} else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0 ) {
			var deltaDepthOverall = 0, depthTest = 0;
			resultsHTML += "<th data-filter='false'>Catch ft</th><th data-filter='false'>FTC ft</th>";
		} else if (locationName.indexOf("Sunken City")>=0 && phaseName!="Docked") {
			var diveMPH = 0;
			resultsHTML += "<th data-filter='false'>Metres<br>per hunt</th>";
		} else if (locationName == "Labyrinth" && phaseName != "Intersection") {
			var avgLanternClues = 0;
			resultsHTML += "<th data-filter='false'>Hallway Clues</th><th data-filter='false'>Dead End Clues</th>";
		}
		resultsHTML += "</tr></thead><tbody>";
		var overallCR = 0;
		var overallAR = findBaseline();
		//console.log("Baseline AR: " + overallAR)
		var overallGold = 0;
		var overallPoints = 0;
		var overallTP = 0;
		var overallPX2 = 0;
		var percentSD = 0;
		var minLuckOverall = 0;
		
		if (specialCharmsList != undefined && specialCharmsList.indexOf(charmName.slice(0,-1)) >= 0) {
			sampleSize = 0;
		}

		for (var i=0; i<noMice; i++) { 
			var mouseName = Object.keys(popArrayLC)[i];

			if (mouseName != "SampleSize") {
				var eff = findEff(mouseName);
			
				// mousename test
				// if (powersArray[mouseName] == undefined) console.log("mouseName: " + mouseName);
				var mousePower = parseInt(powersArray[mouseName][0].replace(/,/g, ''));
				var catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
				//console.log("calcCR()", eff, trapPower, trapLuck, mousePower)

				if (locationName == "Zugzwang's Tower") {
					if (mouseName.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
						charmBonus += 300;
						calculateTrapSetup(); // not "cre" or else infinite loop
						catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
						charmBonus -= 300;
						calculateTrapSetup();
					}
					else if (mouseName == "Mystic Pawn") {
						if (weaponName == "Mystic Pawn Pincher") {
							weaponPower += 10920;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower -= 10920;
							calculateTrapSetup();
						}
						else if (weaponName == "Technic Pawn Pincher") {
							weaponPower -= 59.99;
							weaponBonus -= 5;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower += 59.99;
							weaponBonus += 5;
							calculateTrapSetup();
						}
					}
					else if (mouseName == "Technic Pawn") {
						if (weaponName == "Mystic Pawn Pincher") {
							weaponPower -= 59.99;
							weaponBonus -= 5;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower += 59.99;
							weaponBonus += 5;
							calculateTrapSetup();
						}
						else if (weaponName == "Technic Pawn Pincher") {
							weaponPower += 10920;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower -= 10920;
							calculateTrapSetup();
						}
					}

					if (mouseName.indexOf("Mystic") >= 0) {
						if (weaponName == "Obvious Ambush Trap") {
							weaponPower -= 2400;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower += 2400;
							calculateTrapSetup();
						}
						else if (weaponName == "Blackstone Pass Trap") {
							weaponPower += 1800;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower -= 1800;
							calculateTrapSetup();
						}
					}
					else if (mouseName.indexOf("Technic") >= 0) {
						if (weaponName == "Obvious Ambush Trap") {
							weaponPower += 1800;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower -= 1800;
							calculateTrapSetup();
						}
						else if (weaponName == "Blackstone Pass Trap") {
							weaponPower -= 2400;
							calculateTrapSetup();
							catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
							weaponPower += 2400;
							calculateTrapSetup();
						}
					}
				}

				var minLuckValue = minLuck(eff, mousePower);
				var minLuckOverall = Math.max(minLuckValue, minLuckOverall);
				//console.log("Min luck: " + minLuckValue);

				//Exceptions, modifications to catch rates
				//Dragonbane Charm
				if (charmName == "Ultimate Charm") catchRate = 1;
				else if (locationName == "Sunken City" && charmName == "Ultimate Anchor Charm" && phaseName != "Docked") catchRate = 1;
				else if (mouseName == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
				else if (mouseName == "Bounty Hunter" && charmName == "Sheriff's Badge Charm") catchRate = 1;
				else if (mouseName == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") catchRate = 0;
				
				var attractions = parseFloat(popArrayLC[mouseName])*overallAR;
				
				var catches = attractions*catchRate;

				//console.log(miceArray[mouseName]);

				if (miceArray[mouseName] == undefined) {
					var mouseGold = 0;
					var mousePoints = 0;
				} else {
					var mouseGold = miceArray[mouseName][0];
					var mousePoints = miceArray[mouseName][1];
				}

				//console.log("Gold: " + mouseGold);
				if (charmName == "Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.05, 1800));
				else if (charmName == "Super Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.10, 4500));
				else if (charmName == "Extreme Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.20, 15000));
				
				var gold = catches*mouseGold/100;
				var points = catches*mousePoints/100;

				if (tourneysArray[tournamentName] != undefined) {
					var tourneyPoints = tourneysArray[tournamentName][mouseName];
					if (tourneyPoints == undefined) tourneyPoints = 0;
				} else tourneyPoints = 0;
				var TP = catches*tourneyPoints/100;
				var PX2 = TP*tourneyPoints;

				overallCR += catches;
				overallTP += TP;
				overallPX2 += PX2;
				overallGold += gold;
				overallPoints += points;
				
				//Formatting
				catchRate *= 100;
				catchRate = catchRate.toFixed(2);
				catches = catches.toFixed(2);
				
				resultsHTML += "<tr align='right'><td align='left'>" + mouseName + "</td><td>" + attractions.toFixed(2) + "%</td><td>" + catchRate + "%</td><td>" + catches + "</td><td>" + commafy(mouseGold) + "</td><td>" + commafy(mousePoints) + "</td><td>" + tourneyPoints + "</td><td>" + minLuckValue + "</td>";
				if (locationName.indexOf("Seasonal Garden") >= 0) {
					var dAmp = deltaAmp[mouseName];
					if (charmName == "Amplifier Charm") dAmp *= 2;
					resultsHTML += "<td>" + dAmp + "%</td>";
					// console.log("Amp bonus", dAmp);
					deltaAmpOverall += catches/100 * dAmp;
				} else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
					var deltaDepthCatch = catchDepth[mouseName];
					var deltaDepthFTC = ftcDepth[mouseName];

					if (charmName == "Wax Charm" && berglings.indexOf(mouseName) >= 0) {
						deltaDepthCatch += 1;
					} else if (charmName == "Sticky Charm" && berglings.indexOf(mouseName) >= 0) {
						deltaDepthFTC = 0;
					} else if (baseName == "Spiked Base" && brutes.indexOf(mouseName) >= 0) {
						deltaDepthCatch = deltaDepthFTC = 0;
					} else if (baseName == "Remote Detonator Base" && bombSquad.indexOf(mouseName) >= 0) {
						deltaDepthCatch = 20;
					}
					
					// console.log("Catch dph:", deltaDepthCatch);
					// console.log("FTC dph:", deltaDepthFTC);
					resultsHTML += "<td>" + deltaDepthCatch + "</td><td>" + deltaDepthFTC + "</td>";

					deltaDepthOverall += (catchRate/100 * deltaDepthCatch + (100-catchRate)/100 * deltaDepthFTC)*attractions/100;
					//console.log("Here", (catchRate/100 * deltaDepthCatch + (100-catchRate)/100 * deltaDepthFTC)*attractions/100);
					depthTest += deltaDepthCatch * catches/100 + deltaDepthFTC * (attractions-catches)/100;
				} else if (locationName.indexOf("Sunken City")>=0 && phaseName!="Docked") {
					resultsHTML += "<td></td>";
				} else if (locationName == "Labyrinth" && phaseName != "Intersection") {
					var mouseClues = labyrinthMiceClues[mouseName];
					if (lanternStatus == "On" && mouseClues != 0) mouseClues++;
					if (charmName == "Lantern Oil Charm" && mouseClues != 0) mouseClues++;
					avgLanternClues += mouseClues * catches/100;
					resultsHTML += "<td>" + mouseClues + "</td><td></td>";
				}
				
				resultsHTML += "</tr>";
			}
		}

		if (popArray[locationName][phaseName][commonCheeseIndex] != undefined || popArray[locationName][phaseName][cheeseName] != undefined) {
			if (charmName == "No Charm") {
				if (commonCheeseIndex != undefined) {
					if (popArray[locationName][phaseName][commonCheeseIndex]["-"] != undefined) {
						sampleSize = popArray[locationName][phaseName][commonCheeseIndex]["-"]["SampleSize"];
					}
				}
				else {
					if (popArray[locationName][phaseName][cheeseName]["-"] != undefined) {
						sampleSize = popArray[locationName][phaseName][cheeseName]["-"]["SampleSize"];
					}
				}
			}
			else {
				var slice = '';
				if (charmName.indexOf("*") >= 0) {
					slice = charmName.slice(0,-7);
				}
				else {
					slice = charmName.slice(0,-6);
				}
				if (commonCheeseIndex != undefined) {
					if (popArray[locationName][phaseName][commonCheeseIndex][slice] != undefined) {
						sampleSize = popArray[locationName][phaseName][commonCheeseIndex][slice]["SampleSize"];
					}
					else {
						if (popArray[locationName][phaseName][commonCheeseIndex]["-"] != undefined) {
							sampleSize = popArray[locationName][phaseName][commonCheeseIndex]["-"]["SampleSize"];
						}
					}
				}
				else {
					if (popArray[locationName][phaseName][cheeseName][slice] != undefined) {
						sampleSize = popArray[locationName][phaseName][cheeseName][slice]["SampleSize"];
					}
					else {
						if (popArray[locationName][phaseName][cheeseName]["-"] != undefined) {
							sampleSize = popArray[locationName][phaseName][cheeseName]["-"]["SampleSize"];
						}
					}
				}
			}
		}		
		
		//Formatting
		overallAR *= 100;
		overallPX2 -= overallTP*overallTP;
		overallPX2 = Math.sqrt(overallPX2);
		
		percentSD = overallPX2/overallTP*100;
		
		// console.log("overallCR: " + overallCR);
		resultsHTML += "</tbody><tr align='right'><td align='left'><b>Overall</b></td><td>" + overallAR.toFixed(2) + "%</td><td></td><td>" + overallCR.toFixed(2) + "</td><td>" + commafy(Math.round(overallGold)) + "</td><td>" + commafy(Math.round(overallPoints)) + "</td><td>" + overallTP.toFixed(2) + "</td><td>" + minLuckOverall + "</td>";
		if (locationName.indexOf("Seasonal Garden") >= 0) {
			deltaAmpOverall += (100-overallAR)/100 * -3; //Accounting for FTAs (-3%)
			resultsHTML += "<td>" + deltaAmpOverall.toFixed(2) + "%</td>";
		} else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
			resultsHTML += "<td colspan='2'>" + deltaDepthOverall.toFixed(2) + " ft/hunt</td>";
			// console.log("Depth test", depthTest);
		} else if (locationName.indexOf("Sunken City")>=0 && phaseName!="Docked") {
			diveMPH = 30*overallCR/100 + 10*(overallAR-overallCR)/100;
			if (charmName.indexOf("Anchor Charm") >= 0) {
				diveMPH = 10*overallCR/100 + 10*(overallAR-overallCR)/100;
			}
			else if (charmName.indexOf("Water Jet Charm") >= 0) {
				diveMPH = 500*overallCR/100 + 10*(overallAR-overallCR)/100;
			}
			resultsHTML += "<td>" + diveMPH.toFixed(2) + "</td>";
		} else if (locationName == "Labyrinth" && phaseName != "Intersection") {
			resultsHTML += "<td>" + avgLanternClues.toFixed(2) + "</td>";
			var deadEnds = (overallAR-overallCR)/100;
			if (baseName == "Minotaur Base" || baseName == "Labyrinth Base") deadEnds /= 2; //50% negate rate
			if (charmName == "Compass Magnet Charm") deadEnds = 0;
			resultsHTML += "<td>" + deadEnds.toFixed(2) + "</td>";
		}

		var cheeseEatenPerHunt = overallAR/100;
		var cheeseStaledPerHunt = (100-overallAR)/100*freshness2stale[trapEff];
		resultsHTML += "</tr><tr align='right'><td>Profit (minus cheese cost)</td><td></td><td></td><td></td><td>" + commafy(Math.round(overallGold- cheeseCost*(cheeseEatenPerHunt + cheeseStaledPerHunt))) + "</td><td></td><td></td><td></td>";

		if (locationName.indexOf("Seasonal Garden") >= 0 || locationName.indexOf("Sunken City")>=0 && phaseName!="Docked") {
			resultsHTML += "<td></td>";
		}
		else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
			resultsHTML += "<td colspan='2'></td>";
		}
		else if (locationName == "Labyrinth" && phaseName != "Intersection") {
			resultsHTML += "<td></td><td></td>";
		}
		resultsHTML += "</tr>";
		//resultsHTML += "<tr><td><b>Overall</b></td><td>" + overallAR.toFixed(2) + "%</td><td></td><td>" + overallCR.toFixed(2) + "%</td><td>" + overallGold.toFixed(2) + "</td><td>" + overallPoints.toFixed(2) + "</td><td>" + overallTP.toFixed(2) + "+-" + overallPX2.toFixed(2) + " (" + percentSD.toFixed(2) + "%)</td></tr>";
		
		results.innerHTML = resultsHTML;

		var resort = true, callback = function() {
	    	// empty
	    };
		$("#results").trigger("updateAll", [ resort, callback ]);
	}

	//Set sample size and description of it
	var str = '';
	var colored = '';

	if (sampleSize == 0 || sampleSize == undefined) {
		sizeDescriptor = "N/A";
	}
	else if (sampleSize > 27000) {
		str = "excellent";
		colored = str.fontcolor("orange");
	}
	else if (sampleSize > 10000) {
		str = "good";
		colored = str.fontcolor("green");
	}
	else if (sampleSize > 2400) {
		str = "average";
		colored = str.fontcolor("blue");
	}
	else if (sampleSize > 500) {
		str = "poor";
		colored = str.fontcolor("red");
	}
	else {
		str = "very bad";
		colored = str.fontcolor("purple");
	}

	if (sampleSize != 0 && sampleSize != undefined) {
		sizeDescriptor = sampleSize + " (" + colored + ")";
	}
	var ss = document.getElementById("sampleSize");
	ss.innerHTML = "<tr><td id=\"ssid\">Sample Size</td><td>" + sizeDescriptor + "</td></tr>";
}

function resetCharms () {
	console.log("Reloading charm list");
    var select = document.getElementById("charm");
    var charmsDropdownHTML = '';
    
	var nCharms = Object.size(charmsArray);
	for (var i=0; i<nCharms; i++) {
		var option = Object.keys(charmsArray)[i];
		charmsDropdownHTML += "<option>"+option+"</option>\n";
	}
	select.innerHTML = "<option>No Charm</option>"+charmsDropdownHTML;
	charmChanged();
}

function highlightSpecialCharms (charmList) {
    var select = document.getElementById("charm");
    var charmsDropdownHTML = '';
    
	var nCharms = Object.size(charmsArray);
	for (var i=0; i<nCharms; i++) {
		var option = Object.keys(charmsArray)[i];
		charmsDropdownHTML += "<option>"+option+"</option>\n";
	}
	select.innerHTML = "<option>No Charm</option>"+charmsDropdownHTML;
	
	for (var i=0; i<charmList.length; i++) {
		//console.log("Modifying", charmList[i]);
		for (var j=0; j<select.children.length; j++) {
			var child = select.children[j];
			if (child.value == charmList[i]+" Charm") {
				//console.log(select.innerHTML);
				child.innerHTML = child.innerHTML+"*";
				if (child.selected == true) {
					charmName = child.innerHTML;
					showPop(2);
				}
				select.innerHTML = select.innerHTML.slice(0,25) + "<option>"+child.innerHTML+"</option>" + select.innerHTML.slice(25);
				break;
			}
		}
	}
	selectCharm();
}


function loadLocationDropdown () {
	var locationDropdown = document.getElementById("location");
	var locationDropdownHTML = '<option></option>';

	var popArrayLength = Object.size(popArray);

	for (var i=0; i<popArrayLength; i++) {
		locationDropdownHTML += "<option>"+Object.keys(popArray)[i]+"</option>\n";
	}
	
	locationDropdown.innerHTML = locationDropdownHTML;
	
	var locationParameter = getURLParameter("location");
	if(locationParameter != "null") {
		var select = document.getElementById("location");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == locationParameter) {
				child.selected = true;
		    	locationChanged();
				break;
			}
		}
	}
}


function populateSublocationDropdown (locationName) {
	var sublDropdown = document.getElementById("phase");
	var sublDropdownHTML = '';
	
	var nSublocations = Object.size(popArray[locationName]);
	
	for (var i=0; i<nSublocations; i++) {
		var option = Object.keys(popArray[locationName])[i];
		sublDropdownHTML += "<option>"+option+"</option>\n";
	}
	
	sublDropdown.innerHTML = sublDropdownHTML;
	// location test
	// if (popArray[locationName] == undefined) console.log("locationName: " + locationName);
	phaseName = Object.keys(popArray[locationName])[0];
	
	var phaseParameter = getURLParameter("phase");
	if(phaseParameter != "null") {
		var select = document.getElementById("phase");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == phaseParameter) {
				child.selected = true;
				break;
			}
		}
	}
	
	loadCheeseDropdown();
   	phaseChanged();
	//Load cheese dropdown
}


function loadCheeseDropdown () {
	console.log("Reloading cheese list");
	var cheeseDropdown = document.getElementById("cheese");
	var cheeseDropdownHTML = '';
	
	var cheeseLength = Object.size(popArray[locationName][phaseName]);
	//console.log(cheeseLength);
	
	for (var i=0; i<cheeseLength; i++) {
		var option = Object.keys(popArray[locationName][phaseName])[i];
		if (option.indexOf("/") < 0 || option.indexOf("Combat") >= 0) { //Fix this master cheese thingy	
			cheeseDropdownHTML += "<option>"+option+"</option>\n";
		} else {
			var optionArray = option.split("/");
			var optionArrayLength = Object.size(optionArray);
			for (var j=0; j<optionArrayLength; j++) {
				cheeseDropdownHTML += "<option>"+optionArray[j]+"</option>\n";				
			}
		}
	}
	
	cheeseDropdown.innerHTML = cheeseDropdownHTML;
	
	var cheeseParameter = getURLParameter("cheese");
	if(cheeseParameter != "null" && cheeseLoaded<3) {
		var select = document.getElementById("cheese");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == cheeseParameter) {
				child.selected = true;
				cheeseLoaded++;
		    	//Select correct charm from URL
		    	selectCharm();
				break;
			}
		}
	}
	
	cheeseChanged();
}

function selectCharm () {
	console.log("Selecting charm");
	var charmParameter = getURLParameter("charm");//.replace('*','');
	var specialCharmParameter = charmParameter + "*";
	if(charmParameter != "null" && charmLoaded<5) {
		var select = document.getElementById("charm");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == charmParameter || child.innerHTML == specialCharmParameter) {
				child.selected = true;
		    	charmChanged();
		    	charmLoaded++;
				break;
			}
		}
	}
}

function loadTourneyDropdown() {
	var tourneyDropdown = document.getElementById("tourney");

	var tourneyDropdownHTML = '<option></option>';
	
	var tourneyArrayLength = Object.size(tourneysArray);
	//console.log(tourneyArrayLength);
	
	for (var i=0; i<tourneyArrayLength; i++) {
		tourneyDropdownHTML += "<option>"+Object.keys(tourneysArray)[i]+"</option>\n";
	}
	
	tourneyDropdown.innerHTML = tourneyDropdownHTML;
	
	var tourneyParameter = getURLParameter("tourney");
	if(tourneyParameter != "null") {
		var select = document.getElementById("tourney");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == tourneyParameter) {
				child.selected = true;
		    	tourneyChanged();
				break;
			}
		}
	}
	
}




function calcCR (E, P, L, M) {
//	console.log(E);
//	console.log(P);
//	console.log(L);
//	console.log(M);

	var CR = Math.min((E*P + (3-Math.min(E,2))*Math.pow((Math.min(E,2)*L),2))/(E*P + M), 1);
	
	return CR;
}


function minLuck(E, M) {
	return Math.ceil(Math.sqrt((M/(3-Math.min(E,2)))/(Math.min(E,2)*Math.min(E,2))));
}


function findEff (mouseName) {
	var eff;
	if (trapType == '') eff = 0;
	else {
		// mousename test
		// if (powersArray[mouseName] == undefined) console.log("mouseName: " + mouseName);
		var eff = parseInt(powersArray[mouseName][typeEff[trapType]])/100;
		//console.log(powersArray[mouseName], typeEff[trapType])
		//console.log(trapType, typeEff[trapType]);
	}
	
	//console.log("Eff: " + eff);
	return eff;
}

function findBaseline() {
	//TODO make common cheese ar be global
	var baselineAtt = baselineAttArray[cheeseName];
	if (baselineAtt == undefined) {
		baselineAtt = baselineArray[locationName + " (" + cheeseName + ")"];
		//console.log(baselineAtt);
	}
	
	var overallAtt = baselineAtt + trapAtt/100 - trapAtt/100*baselineAtt;
		
	return overallAtt;
}

function calcSpecialCharms(charmName) {
	var charmsArrayN = charmsArray[charmName]

	if (charmName == "Champion Charm") {
		//Check if GTB used. If so +4 luck
		if (baseName == "Golden Tournament Base") {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3])+4;
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		}
		else if (baseName == "Silver Tournament Base") {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3])+3;
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		}
		else if (baseName == "Bronze Tournament Base") {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3])+2;
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		}
		else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4].trim()];	
		}

	} else if (charmName == "Growth Charm") {
		//Check if soiled base used.
		if (baseName == "Soiled Base") {
			charmPower = parseInt(charmsArrayN[0])+100;
			charmBonus = parseInt(charmsArrayN[1])+3;
			charmAtt = parseInt(charmsArrayN[2])+5;
			charmLuck = parseInt(charmsArrayN[3])+4;
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		}

	} else if (charmName == "Spellbook Charm") {
		//Spellbook base
		if (baseName == "Spellbook Base") {
			charmPower = parseInt(charmsArrayN[0])+500;
			charmBonus = parseInt(charmsArrayN[1])+8;
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4].trim()];
		
		}

	} else if (charmName == "Wild Growth Charm") {
		//Soiled base
		if (baseName == "Soiled Base") {
			charmPower = parseInt(charmsArrayN[0])+300;
			charmBonus = parseInt(charmsArrayN[1])+8;
			charmAtt = parseInt(charmsArrayN[2])+20;
			charmLuck = parseInt(charmsArrayN[3])+9;
			parseFreshness[charmsArrayN[4].trim()];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			parseFreshness[charmsArrayN[4].trim()];
		
		}
	}	
	
	//console.log(charmLuck);
	calculateTrapSetup("cre");
}

/*
function loadGangs (type) {
	if (type == 0) {
		//hide gangs
		document.getElementById("phaseRow").style.display = 'none';
	}
	else {
		//show gangs
		document.getElementById("phaseRow").style.display = 'block';
	}
}
*/

function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getURLParameter (name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function updateLink () {
	var URLString = 'cre.html?';
	
	if (locationName != "") URLString += "&location=" + locationName;
	if (phaseName != "" && phaseName != "-") URLString += "&phase=" + phaseName;
	if (cheeseName != "") URLString += "&cheese=" + cheeseName;
	if (lanternStatus != "") URLString += "&oil=" + lanternStatus;
	if (isToxic != "" && isToxic != "-") URLString += "&toxic=" + isToxic;
	if (batteryPower != 0) URLString += "&battery=" + batteryPower;
	if (weaponName != "") URLString += "&weapon=" + weaponName;
	if (baseName != "") URLString += "&base=" + baseName;
	if (charmName != "") URLString += "&charm=" + charmName;
	if (gsLuck == 0) URLString += "&gs=" + gsLuck;
	if (lbwLuck == 5) URLString += "&lbw=" + lbwLuck;
	if (tournamentName != "") URLString += "&tourney=" + tournamentName;
	
	document.getElementById("link").href = URLString;
	
	var ht_URLString = 'http://horntracker.com/index.php?';
	if (locationName.indexOf("Balack's Cove") >= 0) {
		if (locationName == "Balack's Cove - Low Tide") ht_URLString+= "&location=38&tide=1";
		else if (locationName == "Balack's Cove - Mid Tide") ht_URLString+= "&location=38&tide=2";
		else if (locationName == "Balack's Cove - High Tide") ht_URLString+= "&location=38&tide=3";
	} else if (locationName.indexOf("Claw Shot City") >= 0) {
		if (locationName == "Claw Shot City (Hunting Bounty Hunter)") ht_URLString+= "&location=320&wantedphase=7";
		else if (locationName == "Claw Shot City (Crew)") ht_URLString+= "&location=320&wantedphase=6";
		else if (locationName == "Claw Shot City (Ringleaders)") ht_URLString+= "&location=320&wantedphase=8";
	} else if (locationName.indexOf("Cursed City") >= 0) {
		if (locationName.indexOf("Cursed City (Curse Lifted)") >= 0) ht_URLString+= "&location=311&cc_curse=0";
		else if (locationName == "Cursed City (Cursed)") ht_URLString+= "&location=311&cc_curse=1";
	} else if (locationName.indexOf("Fiery Warpath") >= 0) {
		if (locationName == "Fiery Warpath (Wave 1)") ht_URLString+= "&location=75&wave=1";
		else if (locationName == "Fiery Warpath (Wave 2)") ht_URLString+= "&location=75&wave=2";
		else if (locationName == "Fiery Warpath (Wave 3)") ht_URLString+= "&location=75&wave=3";
		else if (locationName == "Fiery Warpath (Wave 4)") ht_URLString+= "&location=75&wave=4";
	} else if (locationName.indexOf("Gnawnian Express Station") >= 0) {
		if (locationName == "Gnawnian Express Station (Waiting)") ht_URLString+= "&location=321&trainphase=4";
		else if (locationName == "Gnawnian Express Station (Supply Depot)") ht_URLString+= "&location=321&trainphase=1";
		else if (locationName == "Gnawnian Express Station (Raider River)") ht_URLString+= "&location=321&trainphase=2";
		else if (locationName == "Gnawnian Express Station (Daredevil Canyon)") ht_URLString+= "&location=321&trainphase=3";
	} else if(locationName.indexOf("Iceberg") >= 0) {
		if (locationName.indexOf("Iceberg: Bombing Run") >= 0) ht_URLString+= "&location=297&phase=4";
		else if (locationName == "Iceberg: Brutal Bulwark") ht_URLString+= "&location=297&phase=2";
		else if (locationName == "Iceberg: General Stage") ht_URLString+= "&location=297&phase=7";
		else if (locationName == "Iceberg: Hidden Depths") ht_URLString+= "&location=297&phase=12";
		else if (locationName == "Iceberg: Icewing's Lair") ht_URLString+= "&location=297&phase=6";
		else if (locationName == "Iceberg: The Deep Lair") ht_URLString+= "&location=297&phase=13";
		else if (locationName.indexOf("Iceberg: The Mad Depths") >= 0) ht_URLString+= "&location=297&phase=5";
		else if (locationName.indexOf("Iceberg: Treacherous Tunnels") >= 0) ht_URLString+= "&location=297&phase=1";
	} else if(locationName.indexOf("Living Garden") >= 0) {
		if (locationName == "Living Garden (Poured)") ht_URLString+= "&location=301&bucket=2";
		else ht_URLString+= "&location=301&bucket=1";
	} else if(locationName.indexOf("Lost City") >= 0) {
		if (locationName == "Lost City (Cursed)") ht_URLString+= "&location=304&lc_curse=1";
		else ht_URLString+= "&location=304&lc_curse=0";
	} else if(locationName.indexOf("Sand Dunes") >= 0) {
		if (locationName == "Sand Dunes (No Stampede)") ht_URLString+= "&location=302&stampede=0";
		else if (locationName.indexOf("Sand Dunes (Stampede)") >= 0) ht_URLString+= "&location=302&stampede=1";
	} else if(locationName.indexOf("Seasonal Garden") >= 0) {
		if (locationName.indexOf("Fall") >= 0) ht_URLString+= "&location=1&season=1";
		else if (locationName.indexOf("Spring") >= 0) ht_URLString+= "&location=1&season=3";
		else if (locationName.indexOf("Summer") >= 0) ht_URLString+= "&location=1&season=4";
		else if (locationName.indexOf("Winter") >= 0) ht_URLString+= "&location=1&season=2";
	} else if(locationName.indexOf("Twisted Garden") >= 0) {
		if (locationName == "Twisted Garden (Poured)") ht_URLString+= "&location=309&vials=2";
		else ht_URLString+= "&location=309&vials=1";
	}
	
	else if(locationName != "") ht_URLString+= "&location="+locations[locationName];
	if(cheeseName != "") ht_URLString+= "&cheese="+baits[cheeseName];
	if(weaponName != "") ht_URLString+= "&trap="+weapons[weaponName];
	if(baseName != "") ht_URLString+= "&base="+bases[baseName];
	if(charmName != "") ht_URLString+= "&charm="+trinkets[charmName];
	if(gsLuck == 0) ht_URLString+= "&shield="+"0";
	else ht_URLString+= "&shield="+"1";
	if(lbwLuck == 5) ht_URLString+= "&lbw="+lbwLuck;
	if(tournamentName != "") ht_URLString+= "&tourney="+tournamentName;
	//document.getElementById("ht_link").href = ht_URLString;
	
	ga('send', 'event', 'link', 'updated', URLString);
	ga('send', 'event', 'weapon', 'selected', weaponName);
	ga('send', 'event', 'location', 'selected', locationName);
	ga('send', 'event', 'phase', 'selected', phaseName);
	ga('send', 'event', 'cheese', 'selected', cheeseName);
	ga('send', 'event', 'base', 'selected', baseName);
	ga('send', 'event', 'charm', 'selected', charmName);
	ga('send', 'event', 'tournament', 'selected', tournamentName);
}

function locationChanged () {
	console.log("Location changed");
    var select = document.getElementById("location");
	locationName = select.children[select.selectedIndex].innerHTML;
	updateLink();

	hideAllRows();
	if (locationName == "Furoma Rift") {
		$("#batteryRow").show(500);
		$("#frComment").show(500);
	}
	else if (locationName == "Whisker Woods Rift") {
		$("#wwrComment").show(500);
	}
	else if (locationName == "Zugzwang's Tower") {
		$("#ampSlider").slider('option','value',100);
		$("#ampRow").show(500);
		$("#sliderRow").show(500);
		$("#ztComment").show(500);
	}
	else if (locationName == "Labyrinth") {
		$("#labyComment").show(500);
		$("#oilRow").show(500);
	}

	batteryPower = 0;
	ztAmp = 100;
	sampleSize = 0;
	showPop(0);
	//showPop(2);
	
	//Populate sublocation dropdown and select first option
	if (locationName != "") {
		populateSublocationDropdown(locationName);
	}
}

function hideAllRows() {
	$("#phaseRow").hide();
	$("#oilRow").hide();
	$("#toxicRow").hide();
	$("#toxic").val('No');
	$("#batteryRow").hide();
	$("#battery").val('-');
	$("#ampRow").hide();
	$("#sliderRow").hide();
	$("#wwrComment").hide();
	$("#frComment").hide();
	$("#labyComment").hide();
	$("#ztComment").hide();
}

function phaseChanged () {
	console.log("Phase changed");
    var select = document.getElementById("phase");
	phaseName = select.children[select.selectedIndex].innerHTML;

	if (phaseName == "-") {
		$("#phaseRow").hide();
	}
	else {
		$("#phaseRow").show(500);
	}
	
	var autoBase = ''
	if (phaseName.indexOf("Magnet") >= 0) autoBase = "Magnet Base";
	else if ((phaseName == "Bombing Run" || phaseName == "The Mad Depths" || phaseName == "Treacherous Tunnels") && baseName == "Magnet Base") autoBase = " ";
	else if (phaseName.indexOf("Hearthstone") >= 0) autoBase = "Hearthstone Base";
	else if (phaseName == "The Mad Depths" && baseName == "Hearthstone Base") autoBase = " ";
	
	if (autoBase != "") {
		var select = document.getElementById("base");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == autoBase) {
				child.selected = true;
	    		baseChanged();
				break;
			}
		}
	}
	
	if (locationName=="Twisted Garden" && phaseName=="Poured" && pourBonus == 0) {
		pourBonus = 5;
		pourLuck = 5;
		calculateTrapSetup("cre");
	} else if (!(locationName=="Twisted Garden" && phaseName=="Poured") && pourBonus == 5) {
		pourBonus = 0;
		pourLuck = 0;
		calculateTrapSetup("cre");
	}
	
	loadCheeseDropdown();
	updateLink();
}

function cheeseChanged () {
	console.log("Cheese changed");
    var select = document.getElementById("cheese");
	cheeseName = select.children[select.selectedIndex].innerHTML;
	updateLink();
	
	//Basic cheese costs
	var costElement = document.getElementById("cheeseCost");
	if (cheeseName == "Cheddar") {
		costElement.value = 10;
		cheeseCost = 10;
	}
	else if (cheeseName == "Marble") {
		costElement.value = 50;
		cheeseCost = 50;
	}
	else if (cheeseName == "Swiss") {
		costElement.value = 100;
		cheeseCost = 100;
	}
	else if (cheeseName == "Brie") {
		costElement.value = 200;
		cheeseCost = 200;
	}
	else if (cheeseName == "Gouda") {
		costElement.value = 600;
		cheeseCost = 600;
	}
	else if (cheeseName == "Marble String") {
		costElement.value = 300;
		cheeseCost = 300;
	}
	else if (cheeseName == "Swiss String") {
		costElement.value = 800;
		cheeseCost = 800;
	}
	else if (cheeseName == "Brie String") {
		costElement.value = 1600;
		cheeseCost = 1600;
	}
	else {
		costElement.value = 0;
		cheeseCost = 0;
	}

	//Toxic checks
	if (cheeseName == "Brie" || cheeseName == "SB+") {
		$("#toxicRow").show(500);
		toxicChanged();
	}
	else {
		$("#toxicRow").hide();
		toxicChanged();
	}

	showPop();
	//showPop(2);
	selectCharm();
}

function oilChanged() {
	var select = document.getElementById("lanternOil");
	lanternStatus = select.children[select.selectedIndex].innerHTML;

	updateLink();
	calculateTrapSetup("cre");
}

function toxicChanged() {
	var select = document.getElementById("toxic");
	isToxic = select.children[select.selectedIndex].innerHTML;

	if (isToxic == "Yes" && (cheeseName == "Brie" || cheeseName == "SB+")) {
		cheeseBonus = 20;
	}
	else {
		cheeseBonus = 0;
	}

	updateLink();
	calculateTrapSetup("cre");
}

function batteryChanged() {
	var select = document.getElementById("battery");
	var batteryLevel = select.children[select.selectedIndex].innerHTML;
	if (batteryLevel == "1") {
		batteryPower = 1;
	}
	else if (batteryLevel == "2") {
		batteryPower = 2;
	}
	else if (batteryLevel == "3") {
		batteryPower = 3;
	}
	else if (batteryLevel == "4") {
		batteryPower = 4;
	}
	else if (batteryLevel == "5") {
		batteryPower = 5;
	}
	else if (batteryLevel == "6") {
		batteryPower = 6;
	}
	else if (batteryLevel == "7") {
		batteryPower = 7;
	}
	else if (batteryLevel == "8") {
		batteryPower = 8;
	}
	else if (batteryLevel == "9") {
		batteryPower = 9;
	}
	else if (batteryLevel == "10") {
		batteryPower = 10;
	}
	else if (batteryLevel == "-") {
		batteryPower = 0;
	}

	updateLink();
	calculateTrapSetup("cre");
}

function weaponChanged() {
        var select = document.getElementById("weapon");

		weaponName = select.children[select.selectedIndex].innerHTML;
		updateLink();

		var weaponsArrayN = weaponsArray[weaponName];
		if (weaponsArrayN == undefined) weaponsArrayN=[0];

		weaponPower = parseInt(weaponsArrayN[1]);
		trapType = weaponsArrayN[0].trim();
		weaponBonus = parseInt(weaponsArrayN[2]);
		weaponAtt = parseInt(weaponsArrayN[3]);
		weaponLuck = parseInt(weaponsArrayN[4]);
		weaponEff = parseFreshness[weaponsArrayN[5].trim()];
		
		calculateTrapSetup("cre");
}

function baseChanged () {
	console.log("Base changed");
        var select = document.getElementById("base");

		baseName = select.children[select.selectedIndex].innerHTML;
		updateLink();

		var autoPhase = '';		

		if (phaseName == "Bombing Run" && baseName == "Magnet Base") autoPhase = "Bombing Run (Magnet)";
		else if (phaseName == "Bombing Run (Magnet)" && baseName != "Magnet Base") autoPhase = "Bombing Run";

		else if (phaseName == "Treacherous Tunnels" && baseName == "Magnet Base") autoPhase = "Treacherous Tunnels (Magnet)";
		else if (phaseName == "Treacherous Tunnels (Magnet)" && baseName != "Magnet Base") autoPhase = "Treacherous Tunnels";

		else if ((phaseName == "The Mad Depths" || phaseName == "The Mad Depths (Magnet)") && baseName == "Hearthstone Base") autoPhase = "The Mad Depths (Hearthstone)";
		else if ((phaseName == "The Mad Depths" || phaseName == "The Mad Depths (Hearthstone)") && baseName == "Magnet Base") autoPhase = "The Mad Depths (Magnet)";
		else if (phaseName == "The Mad Depths (Hearthstone)" && baseName != "Hearthstone Base") autoPhase = "The Mad Depths";
		else if (phaseName == "The Mad Depths (Magnet)" && baseName != "Magnet Base") autoPhase = "The Mad Depths";

		if (autoPhase != "") {
			var select = document.getElementById("phase");
			for (var i=0; i<select.children.length; i++) {
				var child = select.children[i];
				if (child.innerHTML == autoPhase) {
					child.selected = true;
			    	phaseChanged();
					break;
				}
			}
		}
		
		
		var basesArrayN = basesArray[baseName];
		if (basesArrayN == undefined) basesArrayN=[0];
		
		//Bases with special effects when paired with particular charm
		if (specialCharm[baseName]) calcSpecialCharms(charmName);
		else {
			var charmsArrayN = charmsArray[charmName];

			//If No charm selected
			if (charmsArrayN == undefined) {
				charmsArrayN= [];
				charmsArrayN[0] = 0;
				charmsArrayN[1] = 0;
				charmsArrayN[2] = 0;
				charmsArrayN[3] = 0;
				charmsArrayN[4] = 0;			
			}
		
			else {
				charmPower = parseInt(charmsArrayN[0]);
				charmBonus = parseInt(charmsArrayN[1]);
				charmAtt = parseInt(charmsArrayN[2]);
				charmLuck = parseInt(charmsArrayN[3]);
				charmEff = parseFreshness[charmsArrayN[4].trim()];
			}
		}

		basePower = parseInt(basesArrayN[0]);
		baseBonus = parseInt(basesArrayN[1]);
		baseAtt = parseInt(basesArrayN[2]);
		baseLuck = parseInt(basesArrayN[3]);
		baseEff = parseFreshness[basesArrayN[4].trim()];
		
		calculateTrapSetup("cre");
}

function charmChanged () {
	console.log("Charm changed");
    var select = document.getElementById("charm");

	charmName = select.children[select.selectedIndex].innerHTML;
	updateLink();
	
	var charmsArrayN = charmsArray[charmName.replace('*','')];

	//If No charm selected
	if (charmsArrayN == undefined) {
		charmsArrayN= [];
		charmsArrayN[0] = 0;
		charmsArrayN[1] = 0;
		charmsArrayN[2] = 0;
		charmsArrayN[3] = 0;

		charmPower = parseInt(charmsArrayN[0]);
		charmBonus = parseInt(charmsArrayN[1]);
		charmAtt = parseInt(charmsArrayN[2]);
		charmLuck = parseInt(charmsArrayN[3]);
		charmEff = 0;

		calculateTrapSetup("cre");
	}

	//Charms with special effects when paired with particular base
	else if (specialCharm[charmName]) calcSpecialCharms(charmName);
	//console.log(specialCharm[charmName]);

	else {
		charmPower = parseInt(charmsArrayN[0]);
		charmBonus = parseInt(charmsArrayN[1]);
		charmAtt = parseInt(charmsArrayN[2]);
		charmLuck = parseInt(charmsArrayN[3]);
		charmEff = parseFreshness[charmsArrayN[4].trim()];

		calculateTrapSetup("cre");
	}
	showPop(2);
}

function gsChanged() {
        var select = document.getElementById("gs");

        if (select.children[select.selectedIndex].innerHTML == "Yes") gsLuck = 7;
        else gsLuck = 0;
        
		updateLink();
		calculateTrapSetup("cre");
}

function lbwChanged() {
        var select = document.getElementById("lbw");

        if (select.children[select.selectedIndex].innerHTML == "Yes") lbwLuck = 5;
        else lbwLuck = 0;
        
		updateLink();
		calculateTrapSetup("cre");
}

function tourneyChanged() {
        var select = document.getElementById("tourney");
		tournamentName = select.children[select.selectedIndex].innerHTML;
		updateLink();

		//showPop();
		showPop(2);
}

