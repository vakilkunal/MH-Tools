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
    console.log("Initializing Puppeteer browser...");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "google-chrome-beta"
      // executablePath:
      //   "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
    });

    console.log("Initialization complete. Loading pages...");

    // 2 throwaway pages to try and avoid "Failed to load latest commit information"
    const prePage1 = await browser.newPage();
    console.log("prePage1 object instantiated...");
    await prePage1.goto(htmlUrl);
    console.log("prePage1 navigated to GH URL...");
    const preBody1 = await prePage1.content();
    console.log("prePage1 content loaded...");
    await sleep(200);
    await prePage1.close();
    console.log("prePage1 closed...");
    await sleep(300);
    const prePage2 = await browser.newPage();
    console.log("prePage2 object instantiated...");
    await prePage2.goto(htmlUrl);
    console.log("prePage2 navigated to GH URL...");
    const preBody2 = await prePage2.content();
    console.log("prePage2 content loaded...");
    await sleep(200);
    await prePage2.close();
    console.log("prePage2 closed...");
    await sleep(300);
    const page = await browser.newPage();
    console.log("Final page object instantiated...");
    await page.goto(htmlUrl);
    console.log("Final page navigated to GH URL...");
    const body = await page.content();
    console.log("Final page body acquired...");
    await page.close();
    console.log("Final page closed");
    await browser.close();
    console.log("Browser closed");

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
    console.log("Begin fetchTimestamps routine...");

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
