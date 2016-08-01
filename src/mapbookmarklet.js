javascript:void(function() {
	if (location.href.indexOf("mousehuntgame.com") < 0) {
		alert("You are not on mousehuntgame.com! Please try again.");
		return;
	}
	if (document.querySelector("div.treasureMapPopupContainer.hasMap") == null) {
    	alert("Please navigate to 'Active Map'!");
    	return;
    }

	var mice = [];
    var currLoc = document.getElementsByClassName("treasureMapPopup-mice-groups")[0].className;
    if (currLoc.indexOf("inotherenvironments") < 0) {
        //Locations with periods and apostrophes
        //Extra escapes are workaround for copy link address/JS string handling
        currLoc = currLoc.replace(/\\./g, "\\\\.");
        currLoc = currLoc.replace(/\\'/g, "\\\\'");
    	currLoc = currLoc.replace(" ", ".");
    	var uncaughtLoc = document.querySelectorAll("." + currLoc + " .treasureMapPopup-mice-group-mouse-name span");
    	for (var i=0; i<uncaughtLoc.length; i++) {
    		mice.push(uncaughtLoc[i].textContent);
    	}
    }
    
    var uncaughtOther = document.querySelectorAll(".treasureMapPopup-mice-groups.uncaughtmiceinotherenvironments .treasureMapPopup-mice-group-mouse-name span");
    if (uncaughtOther != null) {
    	for (var i=0; i<uncaughtOther.length; i++) {
    		mice.push(uncaughtOther[i].textContent);
    	}
    }

    var url = "http://tsitu.github.io/MH-Tools/map.html";
    window.open(url + "?mice=" + encodeURI(mice.join("/")), "mhmapsolver");
})();