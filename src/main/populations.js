"use strict";

var POPULATIONS_URL = "data/populations.csv";
var BASELINES_URL = "data/baselines.txt";
var ADVANCEMENT_URL = "data/advancement.csv";
// var POPULATIONS_URL = "https://tsitu.github.io/MH-Tools/data/populations.csv";
// var BASELINES_URL = "https://tsitu.github.io/MH-Tools/data/baselines.txt";
// Uncomment above during local testing to bypass Cross-Origin on Chrome

var popLoaded = 0, baselineLoaded = 0, advancementLoaded = 0;

/**
 * Population data parsed from CSV
 * Object with location - phase - cheese - charm - mouse - pop %
 */
var popArray = {};

/**
 * Cheese baseline attractions
 * @type {{string: float}}
 */
var baselineArray = {};

/**
 * Title advancement percentage
 * @type {{mouse: String, novice: number, recruit: number, apprentice: number, initiate: number, journeyman: number, master: number, grandmaster: number, legendary: number, hero: number, knight: number, lord: : number, baron: : number, count: number, duke: number, grandduke: number, archduke: number}[]}
 */
var advancementArray = {};

/**
 * Start population and baseline loading
 */
function startPopulationLoad() {
    $.get(POPULATIONS_URL, processPop);
    $.get(BASELINES_URL, processBaseline);
    if (typeof processAdvancement === 'function' ) {
        $.get(ADVANCEMENT_URL, processAdvancement);
    }
}

/**
 * Process baseline response text and save it to the baseline Array
 * @param baselineText
 */
function processBaseline(baselineText) {
    var tmpBaselineArray = baselineText.split("\n");

    for (var i = 0; i < tmpBaselineArray.length; i++) {
        var split = tmpBaselineArray[i].split("\t");
        var cheeseName = split[0];
        var attraction = split[1];
        baselineArray[cheeseName] = parseFloat(attraction);
    }

    baselineLoaded = 1;
    if (typeof checkLoadState !== 'undefined' ) {
        checkLoadState();
    }
}

/**
 * Splits a CSV row into an object with labels
 * @param csvRow []
 * @param splitCheese Boolean Indicates whether the cheese string should be split
 * @return {{location: string, phase: string, cheese: [string], charm: string, attraction: Number, mouse: String, sampleSize: String}}
 */
function parseCsvRow(csvRow, splitCheese) {
    var cheese = csvRow[2];

    var cheeseArr = [cheese];
    if (splitCheese) {
        cheeseArr = cheese.split("/");
    }

    return {
        location: csvRow[0],
        phase: csvRow[1],
        cheese: cheeseArr,
        charm: csvRow[3],
        attraction: csvRow[4],
        mouse: csvRow[5],
        sampleSize: csvRow[6]
    };
}

/**
 * This will parse a delimited string into an array of arrays.
 * The default delimiter is the comma, but this can be overriden in the second argument.
 * @param {string} strData - Delimited String
 * @param {string} [strDelimiter=","] - Delimiter for the string. Default is a comma
 * */
function csvToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";

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
