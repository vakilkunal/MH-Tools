javascript:void(function () {
    if (location.href.indexOf("mousehuntgame.com") < 0) {
        alert("You are not on mousehuntgame.com! Please try again.");
        return;
    }
    var defaultURL = "https://tsitu.github.io/MH-Tools/setup.html";
    var waitingURL = "https://tsitu.github.io/MH-Tools/setupwaiting.html";
    // var defaultURL = "https://localhost:8888/setup.html"; //debug

    var PING_DELAY = 4000;
    var MAX_SIZE = 30;
    var SUBMIT_DELAY = 500;

    var bases = [];
    var weapons = [];
    var charms = [];

    var baseIter = 0;
    var weaponIter = 0;
    var charmIter = 0;
    var pingInterval = '';
    var baseButton = document.querySelector("a.campPage-trap-armedItem.base");
    var weaponButton = document.querySelector("a.campPage-trap-armedItem.weapon");
    var charmButton = document.querySelector("a.campPage-trap-armedItem.trinket");
    // Open default URL and give it time to preload, should solve problem of only bases not loading
    var newWindow = window.open(defaultURL, 'mhsetup');

    function openURL(category, items) {
        var url = defaultURL + "?" + category + "=";
        url += encodeURIComponent(items.join('/'));
        url += "/";
        newWindow.location.href = url;
    }

    function checkDOM() {
        baseButton.click();
        var timeout = setTimeout(function () {
            newWindow.close();
            clearInterval(interval);
            alert("Initial XHR timed out! Please check your connection and try again.");
            throw new Error("Initial XHR timed out! Please check your connection and try again.")
        }, PING_DELAY);
        var interval = setInterval(function () {
            if (document.querySelector("div.campPage-trap-itemBrowser.base")) {
                clearTimeout(timeout);
                clearInterval(interval);
                parse();
            }
        }, 100);
    }

    function parse() {

        function getItemList() {
            var selector = ".campPage-trap-itemBrowser-items .campPage-trap-itemBrowser-item-name";
            var nodeList = document.querySelectorAll(selector);
            var all = Array.prototype.map.call(nodeList, function (node) {
                return node.textContent;
            });
            var unique = all.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });
            return unique;
        }

        baseButton.click();
        bases = getItemList();
        console.log("Number of bases: " + bases.length);

        weaponButton.click();
        weapons = getItemList();
        console.log("Number of weapons: " + weapons.length);

        charmButton.click();
        charms = getItemList();
        console.log("Number of charms: " + charms.length);

        var closeButton = document.querySelector("a.campPage-trap-blueprint-closeButton");
        if (closeButton) {
            closeButton.click();
        }

        baseIter = 0;
        weaponIter = 0;
        charmIter = 0;
        //Do not call bases, weapons, charms separately
        //Bases calls weapons when complete, weapons calls charms when complete
        setTimeout(sendBases, SUBMIT_DELAY);
    }


    function sendBases() {
        ping(function () {
            if (baseIter < bases.length) {
                var slice = bases.slice(baseIter, baseIter + MAX_SIZE);
                openURL("bases", slice);
                baseIter += MAX_SIZE;
                setTimeout(sendBases, SUBMIT_DELAY);
            } else {
                sendWeapons()
            }
        });
    }

    function sendWeapons() {
        ping(function () {
            if (weaponIter < weapons.length) {
                var slice = weapons.slice(weaponIter, weaponIter + MAX_SIZE);
                openURL("weapons", slice);
                weaponIter += MAX_SIZE;
                setTimeout(sendWeapons, SUBMIT_DELAY);
            }
            else {
                sendCharms()
            }
        });

    }

    function sendCharms() {
        ping(function () {
            if (charmIter < charms.length) {
                var slice = charms.slice(charmIter, charmIter + MAX_SIZE);
                openURL("charms", slice);
                charmIter += MAX_SIZE;
                setTimeout(sendCharms, SUBMIT_DELAY);
            }
            else {
                newWindow.location.href = defaultURL;
            }
        });
    }

    function ping(callback) {
        var pingTimeout = setTimeout(function () {
            newWindow.close();
            alert("Ping XHR timed out! Please check your connection and try again.");
            //Return doesn't work in callbacks, throw exception
            throw new Error("Ping XHR timed out! Please check your connection and try again.");
        }, PING_DELAY);
        var started = new Date().getTime();
        var cacheBuster = "?nnn=" + started;
        var http = new XMLHttpRequest();
        http.open("GET", "//www.mousehuntgame.com" + cacheBuster, true);
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                clearTimeout(pingTimeout);
                var ended = new Date().getTime();
                var milliseconds = ended - started;
                console.log("Ping time: " + milliseconds + "ms");
                if (callback)
                    callback()
            }
        };
        try {
            http.send(null);
        } catch (exception) {
            console.log("Exception:", exception)
        }
    }

    if (baseButton && weaponButton && charmButton) {
        checkDOM();
    }
    else {
        newWindow.close();
        alert("Please ensure that you have FreshCoat enabled in Support -> User Preferences, then navigate to the Camp page!");
        throw new Error("Please ensure that you have FreshCoat enabled in Support -> User Preferences, then navigate to the Camp page!");
    }
})();