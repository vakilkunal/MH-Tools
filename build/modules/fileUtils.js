(function () {
    const fs = require("fs");
    const readline = require('readline');

    module.exports = {

        /**
         * Read a file line by line
         * @param {string} filename
         * @param {function(err, data)} lineCallback Function called for each line that is read
         * @param {function()} fileCallback Function called when the file stream is closed
         */
        readFileByLine: function (filename, lineCallback, fileCallback) {
            var inputStream = fs.createReadStream(filename);
            var lineReader = readline.createInterface({
                input: inputStream
            });

            lineReader.on("line", lineCallback);
            lineReader.on("close", fileCallback);
        },

        saveJsonFile: function (filename, object, whitespace) {
            const content = JSON.stringify(object, null, whitespace);
            fs.writeFile(filename, content, 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(filename + " was saved");
            });
        }
    };
})();