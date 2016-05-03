"use strict";


var popLoaded = 0, baselineLoaded = 0;
var weaponPower = 0, weaponBonus = 0, weaponLuck = 0, weaponAtt = 0, weaponEff = 0, basePower = 0, baseBonus = 0, baseLuck = 0, baseAtt = 0, baseEff = 0, gsLuck = 7, lbwLuck = 0, charmPower = 0, charmBonus = 0, charmAtt = 0, charmLuck = 0, charmEff = 0, pourBonus = 0, pourLuck = 0;
var trapPower = 0, trapLuck = 0, trapType = '', trapAtt = 0, trapEff = 0;
var baseName = '', charmName = '', locationName = '', cheeseName = '', cheeseBonus = 0, tournamentName = '', weaponName = '', phaseName = '';
var cheeseLoaded = 0, charmLoaded = 0;
var d, popArrayLPC, resultsHTML;

var specialCharm = [];
specialCharm["Champion Charm"] = 1;
specialCharm["Growth Charm"] = 1;
specialCharm["Spellbook Charm"] = 1;
specialCharm["Wild Growth Charm"] = 1;
specialCharm["Golden Tournament Base"] = 1;
specialCharm["Soiled Base"] = 1;
specialCharm["Spellbook Base"] = 1;

//TODO pass arguments to processX() functions instead of using global variables
//TODO load XMLHttpRequests within a function so reduce global variables

function checkLoadState() {
	var loadPercentage = (popLoaded + baselineLoaded)/2*100;
	var status = document.getElementById("status")
	status.innerHTML = "<td>Loaded "+loadPercentage+"%...</td>";
	
	if(loadPercentage == 100) {
		loadLocationDropdown();
		//loadTourneyDropdown();
		//updateLink();
		
		status.innerHTML = "<td>All set!</td>";
		setTimeout(function() {status.innerHTML = '<td><br></td>'}, 3000);
	}
}


var popCSV = [];
var popArray = [];
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
		if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] = [];
		if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] = [];
		popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]][popCSV[i][4]] = parseFloat(popCSV[i][5]);
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




function loadWeaponSelection() {
	var len = Object.size(weaponsArray);
	for (var i=0; i<len; i++) $("#weapons_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='weapon_checkbox' checked>&nbsp" + Object.keys(weaponsArray)[i] + "</td></tr>");
	$(".weapon_checkbox").change(function() { $("#all_weapons_checkbox").prop('checked', false);});
}

function loadBaseSelection() {
	var len = Object.size(basesArray);
	for (var i=0; i<len; i++) $("#bases_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='base_checkbox' checked>&nbsp" + Object.keys(basesArray)[i] + "</td></tr>");
	$(".base_checkbox").change(function() { $("#all_bases_checkbox").prop('checked', false);});
}

function loadCharmSelection() {
	var len = Object.size(charmsArray);
	for (var i=0; i<len; i++) $("#charms_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='charm_checkbox' checked>&nbsp" + Object.keys(charmsArray)[i] + "</td></tr>");
	$(".charm_checkbox").change(function() { $("#all_charms_checkbox").prop('checked', false);});
}






var pop = new XMLHttpRequest();
var baseline = new XMLHttpRequest();
window.onload = function () {
	
	pop.open("get", "https://tsitu.github.io/MH-Tools/data/populations2.csv", true);
	//pop.open("get", "file://localhost/Users/haoala/Desktop/MH/Chrome%20Extensions/CRE/populations.csv", false);
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

	loadWeaponSelection();
	loadBaseSelection();
	loadCharmSelection();

	if (typeof $.cookie('setup') != 'undefined') {
		var savedSetup = JSON.parse($.cookie('setup'));
		var savedWeapons = savedSetup['weapons'];
		var savedBases = savedSetup['bases'];
		var savedCharms = savedSetup['charms'];

		//Object size helper function
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};

		if (savedWeapons.length != Object.size(weaponsArray) || savedBases.length != Object.size(basesArray) || savedCharms.length != Object.size(charmsArray)) {
			window.alert("New weapons/bases/charms have been added. Please re-tick what you own. Sorry for any inconvenience!")
			//Delete cookie
			$.removeCookie('setup');
		} else {
			//Unticks 'All' if there was an unticked box stored in the cookie
			if (savedWeapons.indexOf(0) >= 0) {
				$("#all_weapons_checkbox").prop('checked', false);
			}

			if (savedBases.indexOf(0) >= 0) {
				$("#all_bases_checkbox").prop('checked', false);
			}

			if (savedCharms.indexOf(0) >= 0) {
				$("#all_charms_checkbox").prop('checked', false);
			}

			//Iterates through arrays saved in cookie and unticks checkboxes accordingly
			for (var i=0; i<savedWeapons.length; i++) {
				if (savedWeapons[i] == 0) {
					$(".weapon_checkbox").get(i).checked = false;
				}
			}

			for (var i=0; i<savedBases.length; i++) {
				if (savedBases[i] == 0) {
					$(".base_checkbox").get(i).checked = false;
				}
			}

			for (var i=0; i<savedCharms.length; i++) {
				if (savedCharms[i] == 0) {
					$(".charm_checkbox").get(i).checked = false;
				}
			}	
		}
	}

	/*
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
	*/

	var gsParameter = getURLParameter("gs");
	if(gsParameter != "null") {
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
	if(lbwParameter != "null") {
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

	//console.log(getURLParameter("location"));
	/*
	if(getURLParameter("location") != "null") console.log("boo");
	console.log(getURLParameter("cheese"));
	console.log(getURLParameter("base"));
	console.log(getURLParameter("charm"));
	console.log(getURLParameter("gs"));
	console.log(getURLParameter("lbw"));
	console.log(getURLParameter("tourney"));
	*/


    	
    document.getElementById("location").onchange = function () {
		locationChanged();
    };
	
    document.getElementById("phase").onchange = function () {
		phaseChanged();
    };

    document.getElementById("cheese").onchange = function () {
		cheeseChanged();
    };
	    
	/*
    document.getElementById("charm").onchange = function () {
		charmChanged();
    };
    */

    document.getElementById("gs").onchange = function () {
		gsChanged();
	}
	
    document.getElementById("lbw").onchange = function () {
		lbwChanged();
	}
	
	/*
    document.getElementById("tourney").onchange = function () {
		tourneyChanged();
    };
    */

    $("#save_setup_button").click(function() {
    	var checkedWeapons = [];
    	var checkedBases = [];
    	var checkedCharms = [];
    	for (var i=0; i < Object.size(weaponsArray); i++) {
			if ($(".weapon_checkbox").get(i).checked) {
				checkedWeapons.push(1);
			} else checkedWeapons.push(0);
		}
		for (var i=0; i < Object.size(basesArray); i++) {
			if ($(".base_checkbox").get(i).checked) {
				checkedBases.push(1);
			} else checkedBases.push(0);
		}
		for (var i=0; i < Object.size(charmsArray); i++) {
			if ($(".charm_checkbox").get(i).checked) {
				checkedCharms.push(1);
			} else checkedCharms.push(0);
		}

		//cvalue is an object of 3 arrays, where each is of int strings (either 1 for checked or 0 for not)
		var cvalue = {};
		cvalue['weapons'] = checkedWeapons;
		cvalue['bases'] = checkedBases;
		cvalue['charms'] = checkedCharms;

    	$.cookie.json = true;
    	$.cookie('setup', cvalue, {expires: 30}); //expires in 30 days
    });

    $("#show_pop_button").click(function() {
    	$("#pleaseWaitMessage").show();
    	setTimeout(function() {
    		showPop();
    	}, 1);
    });

    $("#show_weapons_button").click(function() {
    	$("#weapons_selector_table").toggle();
    	$("#bases_selector_table").hide();
    	$("#charms_selector_table").hide();
    })

    $("#show_bases_button").click(function() {
    	$("#bases_selector_table").toggle();
    	$("#weapons_selector_table").hide();
    	$("#charms_selector_table").hide();
    })

    $("#show_charms_button").click(function() {
    	$("#charms_selector_table").toggle();
    	$("#weapons_selector_table").hide();
    	$("#bases_selector_table").hide();
    })

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

    $("#results").bind("sortStart",function() { 
        $("#pleaseWaitMessage").show(); 
    }).bind("sortEnd",function() { 
        $("#pleaseWaitMessage").hide(); 
    }); 


    $("#all_weapons_checkbox").change(function() {
    	if (this.checked) $(".weapon_checkbox").each(function() { this.checked = true; });
    	else $(".weapon_checkbox").each(function() { this.checked = false; });
    })
    $("#all_bases_checkbox").change(function() {
    	if (this.checked) $(".base_checkbox").each(function() { this.checked = true; });
    	else $(".base_checkbox").each(function() { this.checked = false; });
    })
    $("#all_charms_checkbox").change(function() {
    	if (this.checked) $(".charm_checkbox").each(function() { this.checked = true; });
    	else $(".charm_checkbox").each(function() { this.checked = false; });
    })
}


function showTrapSetup(type) {
	var trapSetup = document.getElementById("trapSetup");

	if (type == 0) trapSetup.innerHTML = "<tr><td></td></tr>";
	else {
		trapSetup.innerHTML = "<tr><td>Power</td><td>" + commafy(trapPower) + "</td></tr><tr><td>Luck</td><td>" + trapLuck + "</td></tr><tr><td>Attraction Bonus</td><td>" + trapAtt + "%</td></tr>";
	}
}


function loadLocationDropdown() {
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



function loadCheeseDropdown() {
	var cheeseDropdown = document.getElementById("cheese");
	var cheeseDropdownHTML = '';
	
	var cheeseLength = Object.size(popArray[locationName][phaseName]);
	
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
	if(cheeseParameter != "null" && cheeseLoaded < 3) {
		var select = document.getElementById("cheese");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == cheeseParameter) {
				child.selected = true;
				cheeseLoaded++;
		    	//selectCharm();
				break;
			}
		}
	}

	cheeseChanged();
}

function selectCharm () {
	console.log("Selecting charm");
	var charmParameter = getURLParameter("charm");//.replace('*','');
	if(charmParameter != "null" && charmLoaded<4) {
		var select = document.getElementById("charm");
		for (var i=0; i<select.children.length; i++) {
			var child = select.children[i];
			if (child.innerHTML == charmParameter) {
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




function calcCR(E, P, L, M) {
//	console.log(E);
//	console.log(P);
//	console.log(L);
//	console.log(M);

	var CR = Math.min((E*P + (3-Math.min(E,2))*Math.pow((Math.min(E,2)*L),2))/(E*P + M), 1);
	
	return CR;
}

function findEff(mouseName) {
	var eff;
	if (trapType == '') eff = 0;
	else {
	var eff = parseInt(powersArray[mouseName][typeEff[trapType]])/100;	
	//console.log(trapType);
	}
	return eff;
}

function findBaseline() {
	//TODO make common cheese ar be global
	var baselineAtt = baselineAttArray[cheeseName];
	if (baselineAtt == undefined) {
		baselineAtt = baselineArray[locationName + " (" + cheeseName + ")"];
	}
			
	return baselineAtt;
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
			//console.log(charmLuck);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		}

	} else if (charmName == "Growth Charm") {
		//Check if soiled base used.
		if (baseName == "Soiled Base") {
			charmPower = parseInt(charmsArrayN[0])+100;
			charmBonus = parseInt(charmsArrayN[1])+3;
			charmAtt = parseInt(charmsArrayN[2])+5;
			charmLuck = parseInt(charmsArrayN[3])+4;
			charmEff = parseFreshness[charmsArrayN[4]];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		}

	} else if (charmName == "Spellbook Charm") {
		//Spellbook base
		if (baseName == "Spellbook Base") {
			charmPower = parseInt(charmsArrayN[0])+500;
			charmBonus = parseInt(charmsArrayN[1])+8;
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		}

	} else if (charmName == "Wild Growth Charm") {
		//Soiled base
		if (baseName == "Soiled Base") {
			charmPower = parseInt(charmsArrayN[0])+300;
			charmBonus = parseInt(charmsArrayN[1])+8;
			charmAtt = parseInt(charmsArrayN[2])+20;
			charmLuck = parseInt(charmsArrayN[3])+9;
			charmEff = parseFreshness[charmsArrayN[4]];
		
		} else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];
		
		}
	}	
	
	//console.log(charmLuck);
	calculateTrapSetup();
	//showPop(); console.log("SpecialCharm");
}

function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function updateLink() {
	var URLString = 'best_setup.html?';
	
	if(locationName != "") URLString+= "&location="+locationName;
	if(phaseName != "" && phaseName != "-") URLString+= "&phase="+phaseName;
	if(cheeseName != "") URLString+= "&cheese="+cheeseName;
	//if(weaponName != "") URLString+= "&weapon="+weaponName;
	//if(baseName != "") URLString+= "&base="+baseName;
	//if(charmName != "") URLString+= "&charm="+charmName;
	if(gsLuck == 0) URLString+= "&gs="+gsLuck;
	if(lbwLuck == 5) URLString+= "&lbw="+lbwLuck;
	if(tournamentName != "") URLString+= "&tourney="+tournamentName;
	
	document.getElementById("link").href = URLString;
	
	ga('send', 'event', 'link', 'updated', URLString);
	/*
	ga('send', 'event', 'weapon', 'selected', weaponName);
	ga('send', 'event', 'location', 'selected', locationName);
	ga('send', 'event', 'cheese', 'selected', cheeseName);
	ga('send', 'event', 'base', 'selected', baseName);
	ga('send', 'event', 'charm', 'selected', charmName);
	ga('send', 'event', 'tournament', 'selected', tournamentName);*/
}

function weaponChanged() {
		//updateLink();

		var weaponsArrayN = weaponsArray[weaponName];
		if (weaponsArrayN == undefined) weaponsArrayN=[0];

		weaponPower = parseInt(weaponsArrayN[1]);
		trapType = weaponsArrayN[0].trim();
		weaponBonus = parseInt(weaponsArrayN[2]);
		weaponAtt = parseInt(weaponsArrayN[3]);
		weaponLuck = parseInt(weaponsArrayN[4]);
		weaponEff = parseFreshness[weaponsArrayN[5]];

	
		
		calculateTrapSetup();
}

function locationChanged () {
    var select = document.getElementById("location");
	locationName = select.children[select.selectedIndex].innerHTML;
	ga('send', 'event', 'location', 'changed', locationName);
	updateLink();
	
	//showPop(0);
	
	//Populate sublocation dropdown and select first option
	populateSublocationDropdown(locationName);
}

function phaseChanged () {
	console.log("Phase changed");
    var select = document.getElementById("phase");
	phaseName = select.children[select.selectedIndex].innerHTML;
	ga('send', 'event', 'phase', 'changed', phaseName);
	
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
	
	//calculateTrapSetup("cre");
	
	loadCheeseDropdown();
	updateLink();
}

function cheeseChanged() {
	console.log("Cheese changed");
    var select = document.getElementById("cheese");
	cheeseName = select.children[select.selectedIndex].innerHTML;
	ga('send', 'event', 'cheese', 'changed', cheeseName);
	//ga('send', 'event', 'charm', 'selected', charmName);
	updateLink();

	//showPop();
	//selectCharm();
}

function baseChanged() {
		//updateLink();
		
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
				charmEff = parseFreshness[charmsArrayN[4]];
			}
		}

		basePower = parseInt(basesArrayN[0]);
		baseBonus = parseInt(basesArrayN[1]);
		baseAtt = parseInt(basesArrayN[2]);
		baseLuck = parseInt(basesArrayN[3]);
		baseEff = parseFreshness[basesArrayN[4]];
		
		calculateTrapSetup();
}

function charmChanged() {
		ga('send', 'event', 'charm', 'changed', charmName);
		updateLink();

		var charmsArrayN = charmsArray[charmName];

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

			calculateTrapSetup();
			//showPop();
		}

		//Charms with special effects when paired with particular base
		else if (specialCharm[charmName]) {
			calcSpecialCharms(charmName);
		}
		//console.log(specialCharm[charmName]);

		else {
			charmPower = parseInt(charmsArrayN[0]);
			charmBonus = parseInt(charmsArrayN[1]);
			charmAtt = parseInt(charmsArrayN[2]);
			charmLuck = parseInt(charmsArrayN[3]);
			charmEff = parseFreshness[charmsArrayN[4]];

			calculateTrapSetup();
			//showPop();
		}
		//console.log(charmsArrayN);
}

function gsChanged() {
        var select = document.getElementById("gs");

        if (select.children[select.selectedIndex].innerHTML == "Yes") gsLuck = 7;
        else gsLuck = 0;
        
		updateLink();
		calculateTrapSetup();
		//showPop();
}

function lbwChanged() {
        var select = document.getElementById("lbw");

        if (select.children[select.selectedIndex].innerHTML == "Yes") lbwLuck = 5;
        else lbwLuck = 0;
        
		updateLink();
		calculateTrapSetup();
		//showPop();
}

function tourneyChanged() {
        var select = document.getElementById("tourney");
		tournamentName = select.children[select.selectedIndex].innerHTML;
		updateLink();

		//showPop();
}


function showPop(type) {
	d = new Date();
	//console.log("Showing pop (" + type + ")");
	var results = document.getElementById("results");

	if (locationName == '' || cheeseName == '' || type == 0) {
		results.innerHTML = ''
	} else {
//	    $("#pleaseWaitMessage").show(); 
		//console.log(popArray[locationName][cheeseName]);
		popArrayLPC = popArray[locationName][phaseName][cheeseName];

		//For common cheeses e.g. gouda, brie etc.
		if (popArrayLPC == undefined && cheeseName != "Cheese") {
			var popArrayL = popArray[locationName][phaseName];
			var popArrayLLength = Object.size(popArray[locationName][phaseName]);
			var commonCheeseIndex;
			for (var i=0; i<popArrayLLength; i++) {
				if (Object.keys(popArrayL)[i].indexOf(cheeseName) >= 0 && Object.keys(popArrayL)[i].indexOf("/") >= 0) {
					commonCheeseIndex = Object.keys(popArrayL)[i];
					break;
				}
			}
			popArrayLPC = popArray[locationName][phaseName][commonCheeseIndex];
		}
		
		//console.log(popArrayLC);

		var noMice = Object.size(popArrayLPC["-"]);
		resultsHTML = "<thead><tr><th align='left'>Setup</th>"
		for (var i=0; i<noMice; i++) { 
			resultsHTML += "<th>" + Object.keys(popArrayLPC["-"])[i] + "</th>"
		}		
		resultsHTML += "<th id='overallHeader'>Overall</th></tr></thead><tbody>";
		
		printCombinations(popArrayLPC["-"], resultsHTML);

	}
}

function printCombinations(micePopulation, tableHTML) {
	var results = document.getElementById("results");
	
	
	var baseAR = findBaseline();
	var noMice = Object.size(micePopulation)+1;
	//console.log(noMice);
	
	var power = [];
	for (var mouse in micePopulation) {
		power[mouse] = parseInt(powersArray[mouse][0].replace(/,/g, ''));
	}
	
	var nWeapons = Object.size(weaponsArray);
	var nBases = Object.size(basesArray);
	for (var i=0; i < nWeapons; i++) {
		if (!$(".weapon_checkbox").get(i).checked) continue;
		var weapon = Object.keys(weaponsArray)[i];
		weaponName = weapon;
		weaponChanged();

		var eff = [];
		for (var mouse in micePopulation) {
			eff[mouse] = findEff(mouse)
		}
		
		for (var j=0; j < nBases; j++) {
			if (!$(".base_checkbox").get(j).checked) continue;
			var base = Object.keys(basesArray)[j];
			baseName = base;
			baseChanged();
			//console.log(weapon + base);

			var overallAR = baseAR + trapAtt/100 - trapAtt/100*baseAR;
			var overallCR = 0;
			
			var URLString = 'cre.html?';
			URLString+= "location="+locationName;
			if(phaseName != "-") URLString+= "&phase="+phaseName;
			URLString+= "&cheese="+cheeseName;
			//if(charmName != "") URLString+= "&charm="+charmName;
			if(gsLuck == 0) URLString+= "&gs="+gsLuck;
			if(lbwLuck == 5) URLString+= "&lbw="+lbwLuck;
			URLString+= "&weapon="+weapon;
			URLString+= "&base="+base;
			URLString = URLString.replace(/'/g, "%27");
			
			//console.log(URLString);
			
			tableHTML += "<tr><td><a href='" + URLString + "' target='_blank'>" + weapon + " / " + base + "</a><span style='float: right'><button class='find_best_charm_button'>Find best charm</button></span></td>";
			
			for (var mouse in micePopulation) {

				var attractions = parseFloat(micePopulation[mouse])*overallAR;
			
				
				if (mouse.indexOf("Rook")>=0 && charmName=="Rook Crumble Charm") {
					charmBonus += 300;
					calculateTrapSetup();
				}
				var catchRate = calcCR(eff[mouse], trapPower, trapLuck, power[mouse]);
				//console.log("CR: " + catchRate);
				//console.log(power[mouse]);
				if (mouse.indexOf("Rook")>=0 && charmName=="Rook Crumble Charm") {
					charmBonus -= 300;
					calculateTrapSetup();
				}

				//Exceptions, modifications to catch rates
				if (charmName == "Ultimate Charm") catchRate = 1;
				else if (locationName == "Sunken City" && charmName == "Ultimate Anchor Charm" && phaseName != "Docked") catchRate = 1;
				else if (mouse == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
				else if (mouse == "Bounty Hunter" && charmName == "Sheriff's Badge Charm") catchRate = 1;
				else if (mouse == "Zurreal the Eternal" && weapon != "Zurreal's Folly") catchRate = 0;

				var catches = attractions*catchRate;
				overallCR += catches;
				catches = catches.toFixed(2);

				tableHTML += "<td align='right'>" + catches + "</td>";
				
			}

			overallCR = overallCR.toFixed(2);
			tableHTML += "<td>" + overallCR + "</td></tr>";
		}
	}
	//tableHTML.innerHTML += "<tr><td>" + "Maniacal" + "</td></tr>";
	
	
	tableHTML += "</tbody>"
	results.innerHTML = tableHTML
	
    $(".find_best_charm_button").click(function(event) {
    	console.log("Finding best charm...");
    	var weaponBase = event.target.parentNode.previousSibling.innerHTML;
    	var indexOfSlash = weaponBase.indexOf(" / ");
    	weaponName = weaponBase.slice(0,indexOfSlash);
    	baseName = weaponBase.substr(indexOfSlash+3);
    	weaponChanged();
    	baseChanged();
    	d = new Date();
    	printCharmCombinations(popArrayLPC["-"], resultsHTML);
    });
    
	$("#results").tablesorter({
		/*headers: {
			4: {sorter: "fancyNumber"}, //For gold and points and numbers with commas. Use 0 indexing
			5: {sorter: "fancyNumber"}
		}*/
		
		//,sortList: [[noMice-1,1]]
		sortForce: [[noMice,1]]
	});
	
	$("#overallHeader").click();

	console.log(new Date().getTime()-d.getTime());
}



function printCharmCombinations(micePopulation, tableHTML) {
	var results = document.getElementById("results");
	
	var baseAR = findBaseline();
	var noMice = Object.size(micePopulation)+1;
	//console.log(noMice);
	
	var power = [];
	for (var mouse in micePopulation) {
		power[mouse] = parseInt(powersArray[mouse][0].replace(/,/g, ''));
	}
	
	var nCharms = Object.size(charmsArray);
	for (var i=0; i < nCharms; i++) {
		if (!$(".charm_checkbox").get(i).checked) continue;
		var charm = Object.keys(charmsArray)[i];
		charmName = charm;
		charmChanged();

		var eff = [];
		for (var mouse in micePopulation) {
			eff[mouse] = findEff(mouse)
		}
		
		var overallAR = baseAR + trapAtt/100 - trapAtt/100*baseAR;
		var overallCR = 0;
		
		var URLString = 'cre.html?';
		URLString+= "location="+locationName;
		if(phaseName != "-") URLString+= "&phase="+phaseName;
		URLString+= "&cheese="+cheeseName;
		if(charmName != "") URLString+= "&charm="+charmName;
		if(gsLuck == 0) URLString+= "&gs="+gsLuck;
		if(lbwLuck == 5) URLString+= "&lbw="+lbwLuck;
		URLString+= "&weapon="+weaponName;
		URLString+= "&base="+baseName;
		URLString = URLString.replace(/'/g, "%27");
		
		//console.log(URLString);
		
		tableHTML += "<tr><td><a href='" + URLString + "' target='_blank'>" + weaponName + " / " + baseName + " / " + charmName + "</a><span style='float: right'></span></td>";
		
		for (var mouse in micePopulation) {

			var attractions = parseFloat(micePopulation[mouse])*overallAR;
		
			
			if (mouse.indexOf("Rook")>=0 && charmName=="Rook Crumble Charm") {
				charmBonus += 300;
				calculateTrapSetup();
			}
			var catchRate = calcCR(eff[mouse], trapPower, trapLuck, power[mouse]);
			//console.log("CR: " + catchRate);
			//console.log(power[mouse]);
			if (mouse.indexOf("Rook")>=0 && charmName=="Rook Crumble Charm") {
				charmBonus -= 300;
				calculateTrapSetup();
			}

			//Exceptions, modifications to catch rates
			if (charmName == "Ultimate Charm") catchRate = 1;
			else if (mouse == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
			else if (mouse == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") catchRate = 0;

			var catches = attractions*catchRate;
			overallCR += catches;
			catches = catches.toFixed(2);

			tableHTML += "<td align='right'>" + catches + "</td>";
			
		}

		overallCR = overallCR.toFixed(2);
		tableHTML += "<td>" + overallCR + "</td></tr>";
	}
	//tableHTML.innerHTML += "<tr><td>" + "Maniacal" + "</td></tr>";
	
	
	tableHTML += "</tbody>"
	results.innerHTML = tableHTML
	
	$("#results").tablesorter({
		/*headers: {
			4: {sorter: "fancyNumber"}, //For gold and points and numbers with commas. Use 0 indexing
			5: {sorter: "fancyNumber"}
		}*/
		
		//,sortList: [[noMice-1,1]]
		sortForce: [[noMice,1]]
	});
	
	$("#overallHeader").click();

	console.log(new Date().getTime()-d.getTime());
}