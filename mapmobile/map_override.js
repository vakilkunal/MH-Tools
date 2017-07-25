"use strict";
/**
 * This file contains only overridden functions/variables from original map solver. 
 */
POPULATION_JSON_URL = "../" + POPULATION_JSON_URL;
BASELINES_URL = "../" + BASELINES_URL;

buildMouselist = function (mouseListText, sortedMLCLength, sortedMLC) {
	mouseListText += "<td><table class=\'subtable\'>";
	for (var l = 0; l < sortedMLCLength; l++) {
            var sliceMLC = sortedMLC[l][0].slice(0, sortedMLC[l][0].indexOf("<a href"));
            mouseListText += "<tr><td class=\'subtable-attraction\'>" + sortedMLC[l][1] + "</td><td class=\'subtable-location\'>" + sliceMLC + "</td></tr>";
        }
	mouseListText += "</table></td>";
	return mouseListText;
};