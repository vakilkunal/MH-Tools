(function() {
  const fileUtils = require("./file-utils");
  const puppeteer = require("puppeteer");
  const jsdom = require("jsdom");

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
    // const prePage1 = await browser.newPage();
    // await prePage1.goto(htmlUrl);
    // const preBody1 = await prePage1.content();
    // await sleep(200);
    // await prePage1.close();
    // await sleep(300);
    // const prePage2 = await browser.newPage();
    // await prePage2.goto(htmlUrl);
    // const preBody2 = await prePage2.content();
    // await sleep(200);
    // await prePage2.close();
    // await sleep(300);
    const page = await browser.newPage();
    await page.goto(htmlUrl);
    const body = await page.content();
    // await page.close();
    // await browser.close();

    const { JSDOM } = jsdom;
    const dom = new JSDOM(`${body}`);
    const document = dom.window.document;

    const result = [];
    document.querySelectorAll("time-ago").forEach(el => {
      result.push(el.title);
    });

    return result;
  }

  (async function main() {
    const res = await fetchTimestamps(
      "https://github.com/tsitu/MH-Tools/tree/master/src/bookmarklet"
    ).catch(error => console.log(error));

    console.log(res);

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
  })();
})();
