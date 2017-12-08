(function() {
  const WISDOM = ["data/mouse_wisdom.csv"];
  const csv = require("csvtojson");
  const fs = require("fs");
  const fileUtils = require("./modules/fileUtils");

  var csvConverter = csv({
    colParser: {
      wisdom: "Number"
    }
  });

  var mouseWisdom = {};

  var inputStream = fileUtils.createCombinedStream(WISDOM);
  csvConverter
    .fromStream(inputStream)
    .on("json", function(jsonObj) {
      mouseWisdom[jsonObj["mouse"]] = jsonObj["wisdom"];
    })
    .on("done", function(error) {
      fileUtils.saveJsonFile("data/mouse_wisdom.json", mouseWisdom);
      fileUtils.makeDirectory("data/pretty");
      fileUtils.saveJsonFile("data/pretty/mouse_wisdom.json", mouseWisdom, 4);
    });
})();
