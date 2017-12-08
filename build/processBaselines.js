(function() {
  const BASELINES = ["data/baselines.txt"];
  const fs = require("fs");
  const fileUtils = require("./modules/fileUtils");

  var baselineArray = {};

  for (var i = 0, l = BASELINES.length; i < l; i++) {
    processBaseline(null, fs.readFileSync(BASELINES[i], { encoding: "utf-8" }));
  }

  fileUtils.saveJsonFile("data/baselines.json", baselineArray);
  fileUtils.makeDirectory("data/pretty/");
  fileUtils.saveJsonFile("data/pretty/baselines.json", baselineArray, 4);

  function processBaseline(err, baselineText) {
    if (err) {
      return console.log(err);
    }

    var tmpBaselineArray = baselineText.split("\n");

    for (var i = 0; i < tmpBaselineArray.length; i++) {
      var split = tmpBaselineArray[i].split("\t");
      var cheeseName = split[0];
      var attraction = split[1];
      baselineArray[cheeseName] = parseFloat(attraction);
    }
  }
})();
