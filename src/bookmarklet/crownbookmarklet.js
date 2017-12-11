(function() {
  if (location.href.indexOf("mousehuntgame.com") < 0) {
    alert("You are not on mousehuntgame.com! Please try again.");
    return;
  }
  if (document.querySelector("div.crownheader") == null) {
    alert(
      "Please navigate to Hunter's Profile (Golden Shield) -> King's Crowns"
    );
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

  /**
   * Copy full list to clipboard
   */
  var combinedString = "";
  for (var i = 0; i < miceNames.length; i++) {
    combinedString += miceNames[i] + "\n" + miceCatches[i] + "\n";
  }
  var copyListener = function(event) {
    document.removeEventListener("copy", copyListener, true);
    event.preventDefault();
    var clipboardData = event.clipboardData;
    clipboardData.clearData();
    clipboardData.setData("text/plain", combinedString);
  };
  document.addEventListener("copy", copyListener, true);
  document.execCommand("copy");

  /**
   * Auto-populate top 30 mice
   */
  var url = "https://tsitu.github.io/MH-Tools/crown.html";
  url += "?mice=" + encodeURIComponent(miceNames.splice(0, 30).join("/"));
  url += "?catches=" + encodeURIComponent(miceCatches.splice(0, 30).join("/"));
  var newWindow = window.open("", "mhcrownsolver");
  newWindow.location = url;
})();
