(function () {
    const MOUSE_HEADER = 'mouse';

    const ADVANCEMENTS = ['data/advancement.csv'];
    const csv = require('csvtojson');
    const fs = require('fs');
    const fileUtils = require("./modules/fileUtils");

    var csvConverter = csv({
        colParser: {
            novice: 'Number',
            recruit: 'Number',
            apprentice: 'Number',
            initiate: 'Number',
            journeyman: 'Number',
            master: 'Number',
            grandmaster: 'Number',
            legendary: 'Number',
            hero: 'Number',
            knight: 'Number',
            lord: 'Number',
            baron: 'Number',
            count: 'Number',
            duke: 'Number',
            grandduke: 'Number',
            archduke : 'Number'
        }
    });

    var advancementData = {};

    var inputStream = fileUtils.createCombinedStream(ADVANCEMENTS);
    csvConverter
        .fromStream(inputStream)
        .on('json', function(jsonObj) {
            var mouse = jsonObj[MOUSE_HEADER];
            delete jsonObj[MOUSE_HEADER];
            advancementData[mouse] = jsonObj;
        }). on('done', function (error) {
            fileUtils.saveJsonFile("data/advancement.json", advancementData);
            fileUtils.makeDirectory("data/pretty");
            fileUtils.saveJsonFile("data/pretty/advancement.json", advancementData, 4);
    });
})();
