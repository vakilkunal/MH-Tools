(function() {
  if (location.href.indexOf("mousehuntgame.com") < 0) {
    alert("You are not on mousehuntgame.com! Please try again.");
    return;
  }

  var baseButton = document.querySelector("a.campPage-trap-armedItem.base");
  var weaponButton = document.querySelector("a.campPage-trap-armedItem.weapon");
  var charmButton = document.querySelector("a.campPage-trap-armedItem.trinket");

  function parse() {
    function getItemList() {
      var selector =
        ".campPage-trap-itemBrowser-items .campPage-trap-itemBrowser-item-name";
      var nodeList = document.querySelectorAll(selector);
      var all = Array.prototype.map.call(nodeList, function(node) {
        return node.textContent;
      });
      var unique = all.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });
      return unique;
    }

    baseButton.click();
    var bases = getItemList();
    console.group("Items Owned");
    console.log("Bases: " + bases.length);

    weaponButton.click();
    var weapons = getItemList();
    console.log("Weapons: " + weapons.length);

    charmButton.click();
    var charms = getItemList();
    console.log("Charms: " + charms.length);
    console.groupEnd();

    var closeButton = document.querySelector(
      "a.campPage-trap-blueprint-closeButton"
    );
    if (closeButton) {
      closeButton.click();
    }

    // Combine into a single object and pass to window.name
    var combinedObj = {};
    combinedObj["bases"] = bases;
    combinedObj["weapons"] = weapons;
    combinedObj["charms"] = charms;

    var newWindow = window.open("");
    newWindow.location = "https://tsitu.github.io/MH-Tools/setup.html";
    newWindow.name = JSON.stringify(combinedObj);
  }

  /**
   * Wait for initial XHR to populate bases/weapons/charms in UI
   * Set a 10 second timeout for this operation
   * Check for completion every 100 ms
   */
  function initDOM() {
    baseButton.click();
    var timeout = setTimeout(function() {
      newWindow.close();
      clearInterval(interval);
      alert(
        "XHR timed out after 10 seconds - please check your connection and try again"
      );
      return;
    }, 10000);
    var interval = setInterval(function() {
      if (document.querySelector("div.campPage-trap-itemBrowser.base")) {
        clearTimeout(timeout);
        clearInterval(interval);
        parse();
      }
    }, 100);
  }

  if (baseButton && weaponButton && charmButton) {
    initDOM();
  } else {
    alert(
      "Please ensure that you have FreshCoat enabled in Support -> User Preferences, then navigate to the Camp page!"
    );
    return;
  }
})();
