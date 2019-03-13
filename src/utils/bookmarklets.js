var BOOKMARKLET_URLS = {
  analyzer: "src/bookmarklet/bm-analyzer.min.js",
  crafting: "src/bookmarklet/bm-crafting.min.js",
  cre: "src/bookmarklet/bm-cre.min.js",
  crown: "src/bookmarklet/bm-crown.min.js",
  loader: "src/bookmarklet/bm-loader.min.js",
  map: "src/bookmarklet/bm-map.min.js",
  menu: "src/bookmarklet/bm-menu.min.js",
  powers: "src/bookmarklet/bm-powers.min.js",
  setup_fields: "src/bookmarklet/bm-setup-fields.min.js",
  setup_items: "src/bookmarklet/bm-setup-items.min.js"
};

/**
 * Escape special characters and prepend javascript:void to the string
 * @param {string} content
 * @return {string}
 */
function makeBookmarkletString(content) {
  return "javascript:void" + encodeURI(" " + content);
}
/**
 * Loads bookmarklet content from a js file into an html element's href attribute
 * @param {string} url
 * @param {string} storageKey
 * @param {string} linkSelector
 */
function loadBookmarkletFromJS(url, storageKey, linkSelector) {
  $.get(
    url,
    function(data) {
      checkBookmarklet(makeBookmarkletString(data), storageKey);
    },
    "text"
  );

  function checkBookmarklet(bookmarkletString, storageKey) {
    if (bookmarkletString !== localStorage.getItem(storageKey)) {
      var alertString = "";
      if (storageKey === "bookmarkletLoader") {
        alertString = "The Bookmarklet Auto-Loader has been updated!";
      } else if (storageKey) {
        switch (storageKey) {
          case "creBookmarklet":
            alertString = "The Catch Rate Estimator ";
            break;
          case "mapBookmarklet":
            alertString = "The Map Solver ";
            break;
          case "setupBookmarklet":
            alertString = "The Best Setup: Load Items ";
            break;
          case "setupFieldsBookmarklet":
            alertString = "The Best Setup: Fields ";
            break;
          case "analyzerBookmarklet":
            alertString = "The Marketplace Analyzer ";
            break;
          case "crownBookmarklet":
            alertString = "The Silver Crown Solver ";
            break;
          case "craftingBookmarklet":
            alertString = "The Crafting Wizard ";
            break;
          case "powersBookmarklet":
            alertString = "The Powers Worksheet ";
            break;
        }
        alertString +=
          "bookmarklet has been updated.\nPlease edit accordingly, or try the Auto-Loader!";
      }
      alert(alertString);
      localStorage.setItem(storageKey, bookmarkletString);
    }

    $(linkSelector).attr("href", bookmarkletString);
  }
}
