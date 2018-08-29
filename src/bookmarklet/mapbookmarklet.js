(function() {
  if (location.href.indexOf("mousehuntgame.com") < 0) {
    alert("You are not on mousehuntgame.com! Please try again.");
    return;
  }
  if (!document.querySelector("div.treasureMapPopupContainer.viewMap")) {
    alert("Please navigate to 'Active Map'!");
    return;
  }

  var mice = $(".treasureMapPopup-goals-group-goal:not(.complete)")
    .map(function() {
      var data = $(this).context.textContent;
      // Thunderlord lightning emoji edge case
      if (data.indexOf("Thunderlord") >= 0) {
        return "Thunderlord";
      }
      return data;
    })
    .toArray();
  var url = "https://tsitu.github.io/MH-Tools/map.html";
  url += "?mice=" + encodeURIComponent(mice.join("/"));

  var newWindow = window.open("", "mhmapsolver");
  newWindow.location = url;
})();
