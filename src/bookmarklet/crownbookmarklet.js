(function() {
  if (location.href.indexOf("mousehuntgame.com") < 0) {
    alert("You are not on mousehuntgame.com! Please try again.");
    return;
  }
  if (document.querySelector("div.crownheader") == null) {
    alert("Please navigate to \"King's Crowns'!\"");
    return;
  }

  var miceNames = $(".bronze")
    .parent()
    .parent()
    .find("img")
    .map(function() {
      return $(this).attr("title");
    })
    .get();
  var miceCatches = $(".bronze")
    .map(function() {
      return $(this).text();
    })
    .get();

  var combinedString = "";
  for (var i = 0; i < miceNames.length; i++) {
    combinedString += miceNames[i] + "\n" + miceCatches[i] + "\n";
  }

  //splice(1,30) and autopopulate with crownmode=true, full list in clipboard

  var copyListener = function(event) {
    document.removeEventListener("copy", copyListener, true);
    event.preventDefault();
    var clipboardData = event.clipboardData;
    clipboardData.clearData();
    clipboardData.setData("text/plain", combinedString);
  };
  document.addEventListener("copy", copyListener, true);
  document.execCommand("copy");
})();
