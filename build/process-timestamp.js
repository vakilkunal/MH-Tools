(function() {
  const cheerio = require("cheerio");
  const puppeteer = require("puppeteer");

  const fileUtils = require("./file-utils");

  // Order matters (tree/master/src/bookmarklet)
  const bookmarkletList = [
    "analyzer",
    "crafting",
    "cre",
    "crown",
    "loader",
    "map",
    "menu",
    "powers",
    "setup_fields",
    "setup_items"
  ];

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parses datetime data from master/src/bookmarklet HTML
   * @param {string} htmlUrl
   */
  async function fetchTimestamps(htmlUrl) {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "google-chrome-stable"
      // executablePath:
      //   "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
    });

    // 2 throwaway pages to try and avoid "Failed to load latest commit information"
    const prePage1 = await browser.newPage();
    await prePage1.goto(htmlUrl);
    const preBody1 = await prePage1.content();
    await sleep(200);
    await prePage1.close();
    await sleep(300);
    const prePage2 = await browser.newPage();
    await prePage2.goto(htmlUrl);
    const preBody2 = await prePage2.content();
    await sleep(200);
    await prePage2.close();
    await sleep(300);
    const page = await browser.newPage();
    await page.goto(htmlUrl);
    const body = await page.content();
    await page.close();
    await browser.close();

    const $ = cheerio.load(body);
    const result = $("time-ago")
      .map((i, el) => $(el).attr("title"))
      .get();

    return result;
  }

  fetchTimestamps(
    "https://github.com/tsitu/MH-Tools/tree/master/src/bookmarklet"
  ).then(res => {
    const format = res.map(el => {
      const spl = el.split(", ");
      return `${spl[0]}, ${spl[1]}`;
    });

    const bookmarkletJson = {};
    for (let i = 0; i < bookmarkletList.length; i++) {
      bookmarkletJson[bookmarkletList[i]] = format[i];
    }
    console.log(bookmarkletJson);

    fileUtils.saveJsonFile(
      "data/json/bookmarklet-timestamps.json",
      bookmarkletJson
    );
  });
})();
