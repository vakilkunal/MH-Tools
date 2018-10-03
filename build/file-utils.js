(function() {
  const fs = require("fs");
  const readline = require("readline");
  const mkdirp = require("mkdirp");
  const CombinedStream = require("combined-stream");

  module.exports = {
    /**
     * Read a file line by line
     * @param {string} filename
     * @param {function(err, data)} lineCallback Function called for each line that is read
     * @param {function()} fileCloseCallback Function called when the file stream is closed
     */
    readFileByLine: function(filename, lineCallback, fileCloseCallback) {
      var inputStream = fs.createReadStream(filename);
      var lineReader = readline.createInterface({
        input: inputStream
      });

      lineReader.on("line", lineCallback);
      lineReader.on("close", fileCloseCallback);
    },

    saveJsonFile: function(filename, object, whitespace) {
      const content = JSON.stringify(object, null, whitespace);
      fs.writeFile(filename, content, "utf8", function(err) {
        if (err) {
          return console.log(err);
        }
        console.log(filename + " was saved");
      });
    },

    makeDirectory: function(directory) {
      mkdirp(directory);
    },

    createCombinedStream: function(files) {
      var combinedStream = CombinedStream.create();
      for (var i = 0, l = files.length; i < l; i++) {
        combinedStream.append(fs.createReadStream(files[i]));
      }
      return combinedStream;
    }
  };
})();
