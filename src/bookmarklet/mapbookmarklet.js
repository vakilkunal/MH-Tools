(function() {
  if (!window.jQuery) {
    alert("jQuery does not seem to be enabled on this page");
    return;
  }

  var payload = {
    map_id: user.quests.QuestRelicHunter.default_map_id,
    action: "map_info",
    uh: user.unique_hash,
    last_read_journal_entry_id: lastReadJournalEntryId
  };

  // Extract map mice from a map
  function getMapMice(data, uncaught_only) {
    var mice = [];
    $.each(data.treasure_map.groups, function(key, group) {
      if (uncaught_only && group.name.indexOf("Uncaught mice ") === -1) {
        return;
      }

      $.each(group.goals, function(key, mouse) {
        // Thunderlord lightning emoji edge case
        if (mouse.name.indexOf("Thunderlord") !== -1) {
          mice.push("Thunderlord");
        } else {
          mice.push(mouse.name);
        }
      });
    });
    return mice;
  }

  $.post(
    "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php",
    payload,
    null,
    "json"
  ).done(function(data) {
    if (data) {
      if (!data.treasure_map || data.treasure_map.view_state === "noMap") {
        alert(
          "Please make sure you are logged into MH and are currently on a treasure map"
        );
        return;
      }

      if (data.treasure_map.map_class != "treasure") {
        alert("This map class is not yet supported");
        return;
      }

      var mice = getMapMice(data, true);
      var url = "https://tsitu.github.io/MH-Tools/map.html";
      url += "?mice=" + encodeURIComponent(mice.join("/"));
      var newWindow = window.open("", "mhmapsolver");
      newWindow.location = url;
    }
  });
})();
