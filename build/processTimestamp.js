(function() {
  const request = require("request");
  const cheerio = require("cheerio");

  const fileUtils = require("./modules/fileUtils");
  const bookmarkletList = [
    "analyzer",
    "loader",
    "cre",
    "crown",
    "map",
    "setup"
  ];

  fetchTimestamps(
    "https://github.com/tsitu/MH-Tools/tree/master/src/bookmarklet"
  ).then(res => {
    const bookmarkletJson = {};
    for (let i = 0; i < bookmarkletList.length; i++) {
      bookmarkletJson[bookmarkletList[i]] = res[i];
    }
    fileUtils.saveJsonFile("data/bookmarklet-timestamps.json", bookmarkletJson);
  });

  /**
   * Parses datetime data from master/src/bookmarklet HTML
   * @param {string} htmlUrl
   */
  function fetchTimestamps(htmlUrl) {
    return new Promise((resolve, reject) => {
      const options = {
        url: htmlUrl,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0"
        }
      };
      request(options, (error, response, body) => {
        if (error) {
          reject(Error(error));
        } else if (response.statusCode !== 200) {
          reject(Error(response.statusCode));
        } else {
          const $ = cheerio.load(body);
          const result = $(".css-truncate-target [datetime]")
            .map((i, el) => $(el).text())
            .get();
          resolve(result);
        }
      });
    });
  }
})();
