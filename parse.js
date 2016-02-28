"use strict";


function findSuffix(line, tabIndex) {
		//Find closest suffix
		var suffixC = line.indexOf(" C ");
		if (suffixC < 0) suffixC = 100;
		var suffixCt = line.indexOf(" C\t");
		if (suffixCt < 0) suffixCt = 100;
		var suffixE = line.indexOf(" E ");
		if (suffixE < 0) suffixE = 100;
		var suffixEt = line.indexOf(" E\t");
		if (suffixEt < 0) suffixEt = 100;
		var suffixLE = line.indexOf(" LE ");
		if (suffixLE < 0) suffixLE = 100;
		var suffixLEt = line.indexOf(" LE\t");
		if (suffixLEt < 0) suffixLEt = 100;
		var suffixP = line.indexOf(" P ");
		if (suffixP < 0) suffixP = 100;
		var suffixPt = line.indexOf(" P\t");
		if (suffixPt < 0) suffixPt = 100;
		var suffixS = line.indexOf(" S ");
		if (suffixS < 0) suffixS = 100;
		var suffixSt = line.indexOf(" S\t");
		if (suffixSt < 0) suffixSt = 100;
		var suffixTS = line.indexOf(" TS ");
		if (suffixTS < 0) suffixTS = 100;
		var suffixTSt = line.indexOf(" TS\t");
		if (suffixTSt < 0) suffixTSt = 100;

		var smallestIndex = Math.min(suffixC, suffixE, suffixLE, suffixP, suffixS, suffixTS, suffixCt, suffixEt, suffixLEt, suffixPt, suffixSt, suffixTSt);
		if (smallestIndex == 100) smallestIndex = tabIndex;
		return smallestIndex;
}



/*
var bases = new XMLHttpRequest();
bases.open("get", "https://dl.dropboxusercontent.com/u/14589881/bases.txt", true);
bases.onreadystatechange = function() {
	if (bases.readyState == 4) {
		//console.log(bases.responseText);
		processBases();
	}
}
bases.send();
var basesArray = [];
function processBases() {
	var basesText = bases.responseText.replace(/,/g,"");
	var basesLines = basesText.split("\n");
	var basesLength = basesLines.length;
	//console.log("There are " + (basesLength) + " bases");
	
	for(var i=0; i<basesLength; i++) {
		var regex = /\t/g, result, indices = [];
		while ((result = regex.exec(basesLines[i]))) {
			indices.push(result.index);
		}
		//console.log(indices);

		var smallestIndex = findSuffix(basesLines[i], indices[0]);
		// The following line is buggy, base name should not be until base
		var baseName = basesLines[i].slice(0,smallestIndex);
		console.log(baseName);
		basesArray[baseName] = [basesLines[i].slice(indices[0],indices[1]), basesLines[i].slice(indices[1],indices[2]), basesLines[i].slice(indices[2],indices[3]), basesLines[i].slice(indices[3],indices[4]), basesLines[i].slice(indices[4],indices[5])];
	}
	
	var basesArrayStr = "var basesArray = [];\n";

	for (var key in basesArray) {
		basesArrayStr += "basesArray[\"" + key + "\"] = [];\n";
		for (var key2 in basesArray[key]) {
			//console.log(basesArray[key][key2]);
			basesArrayStr += "basesArray[\"" + key + "\"][" + key2 + "] = \"" + basesArray[key][key2] + "\";\n";
		}
	}

	console.log (basesArrayStr);


	//console.log(basesArray);
	
	basesLoaded = 1;
	checkLoadState();
}
*/


/*
var weapons = new XMLHttpRequest();
weapons.open("get", "https://dl.dropboxusercontent.com/u/14589881/weapons.txt", true);
weapons.onreadystatechange = function() {
	if (weapons.readyState == 4) {
		processWeapons();
	}
}
weapons.send();
var weaponsArray = [];
function processWeapons() {
	var weaponsText = weapons.responseText.replace(/,/g,"");
	var weaponsLines = weaponsText.split("\n");
	var weaponsLength = weaponsLines.length;
	//console.log("There are " + (weaponsLength) + " weapons");
	
	for(var i=0; i<weaponsLength; i++) {
		var regex = /\t/g, result, indices = [];
		while ((result = regex.exec(weaponsLines[i]))) {
			indices.push(result.index);
		}
		//console.log(indices);
				
		var smallestIndex = findSuffix(weaponsLines[i], indices[0]);
		
		weaponsArray[weaponsLines[i].slice(0,smallestIndex)]=[weaponsLines[i].slice(indices[0],indices[1]), weaponsLines[i].slice(indices[1],indices[2]), weaponsLines[i].slice(indices[2],indices[3]), weaponsLines[i].slice(indices[3],indices[4]), weaponsLines[i].slice(indices[4],indices[5]), weaponsLines[i].slice(indices[5],indices[6])];
	}
	
	var weaponsArrayStr = "var weaponsArray = [];\n";

	for (var key in weaponsArray) {
		weaponsArrayStr += "weaponsArray[\"" + key + "\"] = [];\n";
		for (var key2 in weaponsArray[key]) {
			//console.log(weaponsArray[key][key2]);
			weaponsArrayStr += "weaponsArray[\"" + key + "\"][" + key2 + "] = \"" + weaponsArray[key][key2] + "\";\n";
		}
	}

	console.log (weaponsArrayStr);

	//console.log(weaponsArray);

	weaponsLoaded = 1;
	checkLoadState();
}
*/


/*
var charms = new XMLHttpRequest();
charms.open("get", "https://dl.dropboxusercontent.com/u/14589881/charms.txt", true);
charms.onreadystatechange = function() {
	if (charms.readyState == 4) {
		processCharms();
	}
}
charms.send();
var charmsArray = [];
function processCharms() {
	var charmsText = charms.responseText.replace(/,/g,"");
	var charmsLines = charmsText.split("\n");
	var charmsLength = charmsLines.length;
	
	for(var i=0; i<charmsLength; i++) {
		var regex = /\t/g, result, indices = [];
		while ((result = regex.exec(charmsLines[i]))) {
			indices.push(result.index);
		}
		//console.log(indices);
		
		charmsArray[charmsLines[i].slice(0,charmsLines[i].indexOf("Charm")+5)]=[charmsLines[i].slice(indices[0],indices[1]), charmsLines[i].slice(indices[1],indices[2]), charmsLines[i].slice(indices[2],indices[3]), charmsLines[i].slice(indices[3],indices[4]), charmsLines[i].slice(indices[4],indices[5])];
	}


	var charmsArrayStr = "var charmsArray = [];\n";

	for (var key in charmsArray) {
		charmsArrayStr += "charmsArray[\"" + key + "\"] = [];\n";
		for (var key2 in charmsArray[key]) {
			//console.log(charmsArray[key][key2]);
			charmsArrayStr += "charmsArray[\"" + key + "\"][" + key2 + "] = \"" + charmsArray[key][key2] + "\";\n";
		}
	}

	console.log (charmsArrayStr);

	//console.log(charmsArray);

	charmsLoaded = 1;
	checkLoadState();
}
*/


/*
var tourneys = new XMLHttpRequest();
tourneys.open("get", "https://dl.dropboxusercontent.com/u/14589881/tournaments.csv", true);
tourneys.onreadystatechange = function() {
	if (tourneys.readyState == 4) {
		//console.log(tourneys.responseText);

		processTourneys(tourneys.responseText);
	}
}
tourneys.send();
var tourneysCSV = [];
var tourneysArrayOld = [];
function processTourneys(tourneysText) {
	tourneysCSV = CSVToArray(tourneysText);
	//console.log(tourneysCSV);
	
	var tourneysCSVLength = Object.size(tourneysCSV);
	for (var i=0; i<tourneysCSVLength; i++) {
		var tourneyName = tourneysCSV[i][2];
		if (tourneysArrayOld[tourneyName] == undefined) tourneysArrayOld[tourneyName] = [];
		tourneysArrayOld[tourneyName][tourneysCSV[i][0]] = tourneysCSV[i][1];
	}

	//Here this part is the parser
	var tourneysArrayStr = "var tourneysArray = [];\n";

	for (var key in tourneysArrayOld) {
		tourneysArrayStr += "tourneysArray[\"" + key + "\"] = [];\n";
		for (var key2 in tourneysArrayOld[key]) {
			//console.log(tourneysArray[key][key2]);
			tourneysArrayStr += "tourneysArray[\"" + key + "\"][\"" + key2 + "\"] = " + tourneysArrayOld[key][key2] + ";\n";
		}
	}

	console.log (tourneysArrayStr);
	//Here the parser ends

	//tourneysLoaded = 1;
	
	//checkLoadState();

 	//loadTourneyDropdown();
}
*/


/*
var powers = new XMLHttpRequest();
powers.open("get", "https://dl.dropboxusercontent.com/u/14589881/powers.csv", true);
powers.onreadystatechange = function() {
	if (powers.readyState == 4) {
		//console.log(powers.responseText);

		processPowers();
	}
}
powers.send();

var powersCSV = [];
var powersArrayOld = [];
function processPowers() {
	var powersText = powers.responseText;
	
	powersCSV = CSVToArray(powersText);
	//console.log(powersCSV);
	
	var powersCSVLength = Object.size(powersCSV);
	for (var i=0; i<powersCSVLength; i++) {
		var mouseName = powersCSV[i][0];
		if (powersArrayOld[mouseName] == undefined) powersArrayOld[mouseName] = [];
		powersArrayOld[mouseName][0] = powersCSV[i][10];
		for (var j=1; j<11; j++) {
			powersArrayOld[mouseName][j] = powersCSV[i][j+12];
		}
	}

	var powersArrayStr = "var powersArray = [];\n";

	for (var key in powersArrayOld) {
		powersArrayStr += "powersArray[\"" + key + "\"] = [];\n";
		for (var key2 in powersArrayOld[key]) {
			//console.log(powersArray[key][key2]);
			powersArrayStr += "powersArray[\"" + key + "\"][" + key2 + "] = \"" + powersArrayOld[key][key2] + "\";\n";
		}
	}

	console.log (powersArrayStr);

	//console.log(powersArray);
	
	//powersLoaded = 1;
	//checkLoadState();
}
*/


/*
var mice = new XMLHttpRequest();
mice.open("get", "https://dl.dropboxusercontent.com/u/14589881/mice.txt", true);
mice.onreadystatechange = function() {
	if (mice.readyState == 4) {
		//console.log(mice.responseText);

		processMice(mice.responseText);
	}
}
mice.send();
var miceArray = [];
function processMice(miceText) {

	//console.log(miceText);

	miceArray = miceText.split("\n");
	var miceArrayLength = miceArray.length;
	var miceArrayStr = "var miceArray = [];\n";
	
	for (var i=0; i<miceArrayLength; i++) {
		miceArray[i] = miceArray[i].split("\t");
		//console.log(miceArray);

		miceArrayStr += "miceArray[\"" + miceArray[i][0] + "\"] = [];\n";

		miceArrayStr += "miceArray[\"" + miceArray[i][0] + "\"][0] = " + miceArray[i][4].replace(",","") + ";\n";
		miceArrayStr += "miceArray[\"" + miceArray[i][0] + "\"][1] = " + miceArray[i][5].replace(",","") + ";\n";

	}

	console.log(miceArrayStr);
}
*/