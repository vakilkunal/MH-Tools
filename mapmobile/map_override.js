"use strict";
/**
 * Contains only oveerridden functions/variables from original map solver
 */
POPULATIONS_URL = "../data/populations.csv";
BASELINES_URL = "../data/baselines.txt";

buildMouselist = function (mouseListText, sortedMLCLength, sortedMLC) {
	mouseListText += "<td><table class=\'subtable\'>";
	for (var l = 0; l < sortedMLCLength; l++) {
            var sliceMLC = sortedMLC[l][0].slice(0, sortedMLC[l][0].indexOf("<a href"));
            mouseListText += "<tr><td class=\'subtable-attraction\'>" + sortedMLC[l][1] + "</td><td class=\'subtable-location\'>" + sliceMLC + "</td></tr>";
        }
	mouseListText += "</table></td>";
	return mouseListText;
};