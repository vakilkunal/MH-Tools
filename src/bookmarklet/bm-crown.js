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
      var mouseName = $(this).attr("title");

      // Apostrophe mice: [Record] Keeper's Assistant, Ful'Mina, New Year's
      // Thunderlord has lightning emojis surrounding its name
      if (mouseName === "Ful") {
        mouseName = "Ful'Mina, The Mountain Queen";
      } else if (mouseName === "Keeper") {
        if (
          $(this)
            .parent()
            .parent()
            .find(".name")
            .text() === "Keeper's As..."
        ) {
          mouseName = "Keeper's Assistant";
        }
      } else if (mouseName === "Record Keeper") {
        if (
          $(this)
            .parent()
            .parent()
            .find(".name")
            .text() === "Record Keep..."
        ) {
          mouseName = "Record Keeper's Assistant";
        }
      } else if (mouseName === "New Year") {
        mouseName = "New Year's";
      } else if (mouseName.indexOf("Thunderlord") >= 0) {
        mouseName = "Thunderlord";
      }

      // Search for index of ' Mouse' and trim up to it
      var index = mouseName.indexOf(" Mouse");
      if (index > 0) mouseName = mouseName.slice(0, index);

      // Dread Pirate Mousert edge case
      if (mouseName === "Dread Pirate") mouseName = "Dread Pirate Mousert";
      return mouseName;
    })
    .get();
  var miceCatches = $(".bronze")
    .map(function() {
      return $(this).text();
    })
    .get();

  // Cast to object and pass to window.name
  var nameCatchesObj = {};
  for (var i = 0; i < miceNames.length; i++) {
    nameCatchesObj[miceNames[i]] = +miceCatches[i];
  }

  var newWindow = window.open("");
  newWindow.location = "https://tsitu.github.io/MH-Tools/crown.html";
  newWindow.name = JSON.stringify(nameCatchesObj);
})();
