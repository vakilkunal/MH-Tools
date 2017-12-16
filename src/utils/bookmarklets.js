var SETUP_BOOKMARKLET_URL = "src/bookmarklet/setupbookmarklet.min.js";
var ANALYZER_BOOKMARKLET_URL = "src/bookmarklet/analyzerbookmarklet.min.js";
var CRE_BOOKMARKLET_URL = "src/bookmarklet/crebookmarklet.min.js";
var MAP_BOOKMARKLET_URL = "src/bookmarklet/mapbookmarklet.min.js";
var CROWN_BOOKMARKLET_URL = "src/bookmarklet/crownbookmarklet.min.js";
var BOOKMARKLET_LOADER_URL = "src/bookmarklet/bookmarkletloader.min.js";

/**
 * Escape special characters and prepend javascript:void to the string
 * @param content
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
 * @param {function(string)} [callback] Callback function that takes the ajax response data as parameter
 */
function loadBookmarkletFromJS(url, storageKey, linkSelector, callback) {
  $.get(
    url,
    function(data) {
      checkBookmarklet(makeBookmarkletString(data), storageKey);
      if (callback) {
        callback(data);
      }
    },
    "text"
  );

  function checkBookmarklet(bookmarkletString, storageKey) {
    if (bookmarkletString !== localStorage.getItem(storageKey)) {
      alert(storageKey + " has changed - please update accordingly.");
      localStorage.setItem(storageKey, bookmarkletString);
    }

    $(linkSelector).attr("href", bookmarkletString);
  }
}
