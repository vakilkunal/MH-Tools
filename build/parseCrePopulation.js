(function () {
    const SAMPLE_SIZE_LABEL = "SampleSize";

    const csv = require("./modules/csvReader");
    const fileUtils = require("./modules/fileUtils");
    const mkdirp = require("mkdirp");

    var mapPopulations = {};
    var crePopulations = {};
    var setupPopulations = {};

    fileUtils.readFileByLine("data/populations.csv", lineHandler, saveFiles);

    function lineHandler (line) {
        var arr = csv.csvLineToArray(line);
        var rowData = parseCsvRow(arr);
        if (rowData.location !== "Location") {
            processCreSetupPopItem(crePopulations, rowData, true, false);
            processCreSetupPopItem(setupPopulations, rowData, false, true);
            processMapPopItem(mapPopulations, rowData)
        }
    }

    function saveFiles() {
        fileUtils.saveJsonFile("data/populations-cre.json", crePopulations);
        fileUtils.saveJsonFile("data/populations-map.json", mapPopulations);
        fileUtils.saveJsonFile("data/populations-setup.json", setupPopulations);

        mkdirp("data/pretty/");
        fileUtils.saveJsonFile("data/pretty/populations-cre.json", crePopulations, 2);
        fileUtils.saveJsonFile("data/pretty/populations-map.json", mapPopulations, 2);
        fileUtils.saveJsonFile("data/pretty/populations-setup.json", setupPopulations, 2);
    }

    /**
     * Splits a CSV row into an object with labels
     * @param csvRow []
     * @return {{location: string, phase: string, cheese: string, charm: string, attraction: Number, mouse: String, sampleSize: Number}}
     */
    function parseCsvRow(csvRow) {
        return {
            location: csvRow[0],
            phase: csvRow[1],
            cheese: csvRow[2],
            charm: csvRow[3],
            attraction: parseFloat(csvRow[4]),
            mouse: csvRow[5],
            sampleSize: parseInt(csvRow[6])
        };
    }

    /**
     * Adds an empty object as the value for a key if the object does not contain the key jet
     * @param object
     * @param key
     */
    function addKey(object, key) {
        if (object[key] === undefined) {
            object[key] = {};
        }
    }

    function processCreSetupPopItem(population, row, includeSampleSize, splitCheese) {
        addKey(population, row.location);
        addKey(population[row.location], row.phase);

        var cheeses = splitCheese ? row.cheese.split("/") : [row.cheese];
        for (var cheeseIndex = 0; cheeseIndex < cheeses.length; cheeseIndex++) {
            var cheese = cheeses[cheeseIndex];

            addKey(population[row.location][row.phase], cheese);
            addKey(population[row.location][row.phase][cheese], row.charm);

            population[row.location][row.phase][cheese][row.charm][row.mouse] = row.attraction;

            if (includeSampleSize && row.sampleSize) {
                population[row.location][row.phase][cheese][row.charm][SAMPLE_SIZE_LABEL] = row.sampleSize;
            }
        }
    }

    function processMapPopItem(populationObject, row) {
        function capitalise(str) {
            return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        }

        var mouseName = capitalise(row.mouse);
        var cheese = row.cheese;
        var attractionRate = row.attraction;

        addKey(populationObject, mouseName);
        addKey(populationObject[mouseName], row.location);
        addKey(populationObject[mouseName][row.location], row.phase);
        addKey(populationObject[mouseName][row.location][row.phase], cheese);

        populationObject[mouseName][row.location][row.phase][cheese][row.charm] = attractionRate;
    }
})();
