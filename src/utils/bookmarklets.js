/**
 * Loads bookmarklet content from a js file into an html element's href attribute
 * @param {string} url
 * @param {string} storageKey
 * @param {string} linkSelector
 * @param {function(string)} [postProcess] Post processing function
 */
function loadBookmarkletFromJS(url, storageKey, linkSelector, postProcess) {
    $.get(url, function (data) {
        if (postProcess) {
            data = postProcess(data);
        }
        checkBookmarklet("javascript:void" + encodeURI(" " + data), storageKey);
    }, "text");

    function checkBookmarklet(bookmarkletString) {
        if (bookmarkletString !== localStorage.getItem(storageKey)) {
            alert("Bookmarklet has changed! Please update accordingly.");
            localStorage.setItem(storageKey, bookmarkletString);
        }

        $(linkSelector).attr("href", bookmarkletString);
    }
}
