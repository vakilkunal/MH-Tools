(function() {
  const { exec } = require("child_process");
  const fs = require("fs");
  const fileUtils = require("./modules/fileUtils");

  const gitLogCmd = "git log -n 1 --pretty=format:%at -- src/bookmarklet/";
  const bookmarkletList = {
    "analyzerbookmarklet.js": "analyzer",
    "crebookmarklet.js": "cre",
    "crownbookmarklet.js": "crown",
    "mapbookmarklet.js": "map",
    "setupbookmarklet.js": "setup",
    "bookmarkletloader.js": "loader"
  };

  getAllTimestamps().then(res => {
    fileUtils.saveJsonFile("data/bookmarklet-timestamps.json", res);
  });

  function getAllTimestamps() {
    return new Promise(function(resolve, reject) {
      const out = {};
      const promiseArr = [];
      Object.keys(bookmarkletList).forEach(el => {
        promiseArr.push(
          getTimestampAsync(gitLogCmd + el).then(res => {
            out[bookmarkletList[el]] = res;
          })
        );
      });
      Promise.all(promiseArr).then(res => resolve(out));
    });
  }

  /**
   * Asynchronously execute command and return stringified UTC timestamp
   * @param {string} cmd
   * @return {Promise}
   */
  function getTimestampAsync(cmd) {
    return new Promise(function(resolve, reject) {
      exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(err); // node couldn't execute the command
        resolve(time(Number(stdout)));
      });
    });
  }

  /**
   * Convert seconds to time string
   * @param {number} s UNIX timestamp
   * @return {string}
   */
  function time(s) {
    const t = new Date(s * 1e3).toISOString();
    const o = `${t.slice(0, 10)} ${t.slice(-13, -5)} UTC`;
    return o;
  }
})();
