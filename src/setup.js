"use strict";

var NO_CHARM = "-";
var loadedParams = {
    cheese: false,
    charm: false
};

var instructionString = "Drag the blue 'Best Setup' link to your bookmarks bar if possible. If that doesn't work, try the manual steps below.\n\n"
    + "Google Chrome:\n- Bookmark a random page and name it 'Best Setup Bookmarklet'"
    + "\n- Copy the bookmarklet code by right-clicking the 'Best Setup' link and selecting 'Copy link address...'"
    + "\n- Right click the newly created bookmark and select 'Edit...'"
    + "\n- Paste into the 'URL' field\n\n"
    + "Firefox:\n- Right click the 'Best Setup' link and select 'Bookmark This Link'\n\n"
    + "Internet Explorer:\n- Right click the 'Best Setup' link and select 'Add to favorites...'\n\n"
    + "Mobile/Other Browsers:\n- Same concept as above. Processes may vary";

$(window).load(function () {
    var bonusLuckParameter, loaded;

    user = "setup";

    //Instructions
    $("#instructions").click(function () {
        alert(instructionString);
    });

    //Bookmarklet storage logic
    if (setupBookmarkletString !== localStorage.getItem("setupBookmarklet")) {
        alert("Bookmarklet has changed! Please update accordingly.");
        localStorage.setItem("setupBookmarklet", setupBookmarkletString);
    }
    $("#bookmarklet").attr("href", setupBookmarkletString);
    $("#slowBookmarklet").attr("href", setupBookmarkletString.replace(/=500/g, "=2500"));
    $("#evenslowerBookmarklet").attr("href", setupBookmarkletString.replace(/=500/g, "=6000"));

    loadItemSelection(weaponKeys, "weapon");
    loadItemSelection(baseKeys, "base");
    loadItemSelection(charmKeys, "charm");

    loaded = loadURLData();
    if (!loaded) {
        checkCookies();
        startPopulationLoad();
        $("#main").show(500);
    }
    gsParamCheck();

    bonusLuckParameter = parseInt(getURLParameter("bonusLuck"));
    if (bonusLuckParameter >= 0) {
        document.querySelector("#bonusLuck").value = bonusLuckParameter;
        bonusLuckChanged();
    }

    showHideWidgets();

    document.querySelector("#location").onchange = locationChanged;
    document.querySelector("#phase").onchange = phaseChanged;
    document.querySelector("#cheese").onchange = cheeseChanged;
    document.querySelector("#charm").onchange = charmChanged;
    document.querySelector("#toxic").onchange = toxicChanged;
    document.querySelector("#battery").onchange = batteryChanged;
    document.querySelector("#gs").onchange = gsChanged;
    document.querySelector("#bonusLuck").onchange = bonusLuckChanged;

    $("#save_setup_button").click = saveSetupCookie;

    $("#show_pop_button").click(function () {
        $("#pleaseWaitMessage").show();
        setTimeout(showPop, 1);
    });
    bindSelectorButtons();

    $("#results").bind("sortStart", function () {
        $("#pleaseWaitMessage").show();
    }).bind("sortEnd", function () {
        $("#pleaseWaitMessage").hide();
    });

    /**
     * Toggle weapon/charm/base selector
     */
    function bindSelectorButtons() {
        var weaponsTable = getSelectors("weapon").container;
        var baseTable = getSelectors("base").container;
        var charmTable = getSelectors("charm").container;

        $("#show_weapons_button").click(function () {
            $(weaponsTable).toggle();
            $(baseTable).hide();
            $(charmTable).hide();
        });

        $("#show_bases_button").click(function () {
            $(baseTable).toggle();
            $(weaponsTable).hide();
            $(charmTable).hide();
        });

        $("#show_charms_button").click(function () {
            $(charmTable).toggle();
            $(weaponsTable).hide();
            $(baseTable).hide();
        });
    }
});


function checkLoadState() {
    var batteryParameter;
    var loadPercentage = (popLoaded + baselineLoaded) / 2 * 100;
    var status =document.querySelector("#status");
    status.innerHTML = "<td>Loaded " + loadPercentage + "%...</td>";

    if (loadPercentage == 100) {
        loadLocationDropdown();
        checkToxicParam();

        batteryParameter = getURLParameter("battery");
        if (batteryParameter != "null") {
           document.querySelector("#battery").value = parseInt(batteryParameter);
        }

        status.innerHTML = "<td>All set!</td>";
        setTimeout(function () {
            status.innerHTML = "<td><br></td>";
        }, 3000);
    }
}

/**
 * Get Jquery selectors for a specific type
 * @param type {string} 'weapon', 'base' or 'charm'
 * @returns {{checkbox: string, container: string, allCheckbox: string}}
 */
function getSelectors(type) {
    var checkboxClass = type + "_checkbox";
    return {
        checkboxClass: checkboxClass,
        labelClass: checkboxClass + "-label",
        checkbox: "." + checkboxClass,
        container: "#" + type + "s_selector_table",
        allCheckbox: "#all_" + type + "s_checkbox",
        name: type + "-owned"
    };
}

/**
 * Populates item checkboxes
 * @param itemKeys {string[]}
 * @param type {string} @see {@link getSelectors}
 */
function loadItemSelection(itemKeys, type) {
    var i;
    var select = getSelectors(type);
    for (i = 0; i < itemKeys.length; i++) {
        var checkboxItem = buildCheckboxItem(select, itemKeys[i]);
        $(checkboxItem).appendTo(select.container).wrap("<li>");
    }

    $(select.checkbox).change(function () {
        $(select.allCheckbox).prop("checked", false);
    });

    $(select.allCheckbox).change(function () {
        var checked = this.checked;
        $(select.checkbox).prop("checked", checked);
    });

    /**
     * Builds jquery object with checkbox to insert
     * @param select
     * @param itemName
     * @returns {jQuery}
     */
    function buildCheckboxItem(select, itemName) {
        var row = $("<label></label>");
        $("<input />", {
            "type": "checkbox",
            "checked": "checked",
            "value": itemName,
            "class": select.checkboxClass,
            "name": select.name
        }).appendTo(row);
        $("<span />", {
            "class": select.labelClass,
            "text": itemName}
            ).appendTo(row);
        return row;
    }
}

/**
 * Check and load cookies and localstorage
 */
function checkCookies() {
    var storedData = JSON.parse(localStorage.getItem("setupData"));
    var cookie = Cookies.get("setup");
    if (storedData) {
        processStoredData(storedData);
    } else if(cookie) {
        loadOwnedCookie(cookie);
    }

    function selectCheckboxes(savedItems, type) {
        var selectors = getSelectors(type);
        var i;
        $(selectors.allCheckbox).prop("checked", false);
        for (i = 0; i < savedItems.length; i++) {
            $(selectors.checkbox).get(i).checked = savedItems[i];
        }
    }

    function loadOwnedCookie(setupCookie) {
        var savedSetup = JSON.parse(setupCookie);
        var savedWeapons = savedSetup["weapons"] || [];
        var savedBases = savedSetup["bases"] || [];
        var savedCharms = savedSetup["charms"] || [];

        if (savedWeapons.length !== weaponKeys.length
            || savedBases.length !== baseKeys.length
            || savedCharms.length !== charmKeys.length) {
            window.alert("New items have been added. Please re-tick what you own, or use the bookmarklet. Sorry for any inconvenience!");
            Cookies.remove("setup");
        } else {
            if (contains(savedWeapons, 0)) {
                selectCheckboxes(savedWeapons, "weapon");
            }

            if (contains(savedBases, 0)) {
                selectCheckboxes(savedBases, "base");
            }

            if (contains(savedCharms, 0)) {
                selectCheckboxes(savedCharms, "charm");
            }
        }
    }

    function processStorageArray(indexArray, ownedItems, type) {
        var currentItem, i;
        var selectors = getSelectors(type);

        $(selectors.checkbox).prop("checked", false);
        $(selectors.allCheckbox).prop("checked", false);
        for (i = 0; i < indexArray.length; i++) {
            currentItem = indexArray[i];
            if (contains(ownedItems, currentItem)) {
                $(selectors.checkbox).get(i).checked = true;
            }
        }
    }

    function processStoredData(storedData) {
        var ownedBases = storedData["bases"];
        var ownedWeapons = storedData["weapons"];
        var ownedCharms = storedData["charms"];

        console.log("Bases loaded: " + ownedBases.length);
        console.log("Weapons loaded: " + ownedWeapons.length);
        console.log("Charms loaded: " + ownedCharms.length);

        if (ownedBases && ownedBases.length > 0) {
            processStorageArray(baseKeys, ownedBases, "base");
        }
        if (ownedWeapons && ownedWeapons.length > 0) {
            if (ownedWeapons.indexOf("Isle Idol Trap") > 0) {
                ownedWeapons.push("Isle Idol Hydroplane Skin");
                ownedWeapons.push("Isle Idol Stakeshooter Skin");
            }

            processStorageArray(weaponKeys, ownedWeapons, "weapon");
        }
        if (ownedCharms && ownedCharms.length > 0) {
            processStorageArray(charmKeys, ownedCharms, "charm");
        }
        localStorage.removeItem("setupData");
        saveSetupCookie();
    }
}

/**
 * Load bookmarklet data from URL
 * @returns {boolean} Indicates whether any data was loaded
 */
function loadURLData() {
    var urlBases = getDataFromURL(window.location.search.match(/bases=([^&]*)/));
    var urlWeapons = getDataFromURL(window.location.search.match(/weapons=([^&]*)/));
    var urlCharms = getDataFromURL(window.location.search.match(/charms=([^&]*)/));

    if (urlBases.length === 0
        && urlWeapons.length === 0
        && urlCharms.length === 0) {
        return false;
    }
    else {
        if (urlBases.length > 0) {
            processUrlData(urlBases, "bases");
        }
        if (urlWeapons.length > 0) {
            processUrlData(urlWeapons, "weapons");
        }
        if (urlCharms.length > 0) {
            processUrlData(urlCharms, "charms");
        }
        return true;
    }

    function getDataFromURL(parameters) {
        if (parameters) {
            return decodeURIComponent(parameters[1]).split("/");
        } else {
            return [];
        }
    }

    function processUrlData(urlItemArray, type) {
        var storedData = localStorage.getItem("setupData");
        var dataObject = JSON.parse(storedData) || {};
        var dataLen = urlItemArray.length - 1;
        var ownedItemArray = dataObject[type] || [];
        var i, itemName;

        for (i = 0; i < dataLen; i++) {
            itemName = urlItemArray[i];
            if (ownedItemArray.indexOf(itemName) < 0) {
                ownedItemArray.push(itemName);
            }
        }

        if (Object.size(dataObject) > 0) {
            localStorage.setItem("setupData", JSON.stringify(dataObject));
            window.location.replace("setupwaiting.html");
        }
    }
}

/**
 * Saves selected weapons, bases and charms to a cookie
 */
function saveSetupCookie() {
    var checkedWeapons = getCookieArray(getSelectors("weapon").checkbox);
    var checkedBases = getCookieArray(getSelectors("base").checkbox);
    var checkedCharms = getCookieArray(getSelectors("charm").checkbox);

    var cvalue = {
        weapons : checkedWeapons,
        bases : checkedBases,
        charms :  checkedCharms
    };

    Cookies.set("setup", cvalue, {
        expires: 365
    });

    /**
     * Builds array of 1's and 0's from selected checkboxes
     * @param selector {string}
     * @returns Number[]
     */
    function getCookieArray(selector) {
        return $(selector).map(function () {
            return Number($(this).prop("checked"));
        }).toArray();
    }
}

/**
 * Loads the cheese dropdown menu
 */
function loadCheeseDropdown(location, phase) {
    var cheeseDropdown = document.querySelector("#cheese");
    var cheeseDropdownHTML = "";

    var insertedCheeses = [];

    for (var cheeseOption in popArray[location][phase]) {
        if (cheeseOption.indexOf("/") < 0 || contains(cheeseOption,"Combat")) { //Todo: Fix this master cheese thingy
            cheeseDropdownHTML = addCheeseOption(insertedCheeses, cheeseOption, cheeseDropdownHTML);
        }
        else {
            splitCheeseOption(cheeseOption);
        }
    }

    cheeseDropdown.innerHTML = cheeseDropdownHTML;
    cheeseDropdown.selectedIndex = 0;

    if (!loadedParams.cheese) {
        checkCheeseParam();
        loadedParams.cheese = true;
    }

    cheeseChanged();

    function splitCheeseOption(option) {
        var optionArray = option.split("/");
        for (var j = 0; j < Object.size(optionArray); j++) {
            cheeseDropdownHTML = addCheeseOption(insertedCheeses, optionArray[j], cheeseDropdownHTML);
        }
    }

    function checkCheeseParam() {
        var select = document.querySelector("#cheese");
        var cheeseParameter = getURLParameter("cheese");
        if (cheeseParameter !== "null") {
            select.value = cheeseParameter;
        }
        if (select.selectedIndex === -1) {
            select.selectedIndex = 0;
        }
    }

    function addCheeseOption(insertedCheeses, cheeseName, cheeseDropdownHTML) {
        if (!contains(insertedCheeses, cheeseName)) {
            cheeseDropdownHTML += "<option>" + cheeseName + "</option>\n";
            insertedCheeses.push(cheeseName);
        }
        return cheeseDropdownHTML;
    }
}

function loadCharmDropdown(location, phase, cheese) {
    var charms;

    /**
     * Population array for Location-Phase-Cheese
     */
    var popArrayLPC = popArray[location][phase][cheese];

    fillPopArray(cheese);

    charms = Object.keys(popArrayLPC);
    charms.sort();
    populateDropdown(charms, "#charm");

    if (!loadedParams.charm) {
        checkCharmParameter();
        loadedParams.charm = true;
    }

    function populateDropdown(items, selector) {
        var dropdown = $(selector).html("<option>-</option>");
        for (var i = 0; i < items.length; i++) {
            if (items[i] != NO_CHARM) {
                $("<option/>", {
                    text: items[i],
                    value: items[i]
                }).appendTo(dropdown);
            }
        }
    }

    function checkCharmParameter() {
        var charmParameter = getURLParameter("charm");
        var select = document.querySelector("#charm");
        if (charmParameter != "null") {
            select.value = charmParameter;
        }
        if (select.selectedIndex == -1) {
            select.selectedIndex = 0;
        }
        charmChanged();
    }

    function fillPopArray(searchCheese) {
        var popArrayLP;
        if (!popArrayLPC) {
            popArrayLP = popArray[location][phase];
            // Search through popArrayLP for cheese matching currently armed cheese
            // TODO: Improve
            for (var popcheese in popArrayLP) {
                if (contains(popcheese,searchCheese)) {
                    popArrayLPC = popArray[location][phase][searchCheese];
                }
            }
        }
    }
}

function updateLink() {
    var select =document.querySelector("#charm");
    var selectedCharm = select.value;

    var urlParams = {
        "location" : locationName,
        "phase" : phaseName,
        "cheese" : cheeseName,
        "charm" : selectedCharm,
        "toxic" : isToxic,
        "battery" : batteryPower,
        "gs" : !gsLuck,
        "bonusLuck" : bonusLuck,
        "tourney" : tournamentName
    };

    var urlString = buildURL("setup.html",urlParams);
    document.querySelector("#link").href = urlString;

    ga("send", "event", "link", "updated", urlString);
}

function weaponChanged() {
    populateWeaponData(weaponName);
    calculateTrapSetup();
}

function locationChanged() {
    var select = document.querySelector("#location");
    locationName = select.value;

    updateLink();
    showHideWidgets();

    batteryPower = 0;
    ztAmp = 100;

    if (locationName !== "") {
        populateSublocationDropdown(locationName);
    }
    phaseChanged();
}

function cheeseChanged() {
    ga("send", "event", "cheese", "changed", cheeseName);

    cheeseName = document.querySelector("#cheese").value;
    updateLink();
    checkToxicWidget();
    loadCharmDropdown(locationName, phaseName, cheeseName);
}

function baseChanged() {

    //Bases with special effects when paired with particular charm
    if (specialCharm[baseName]) {
        calcSpecialCharms(charmName);
    }
    else {
        populateCharmData(charmName);
    }

    populateBaseData(baseName);
    calculateTrapSetup();
}

function charmChanged(customValue) {
    var selectedVal = $("#charm").val();
    if (selectedVal !== NO_CHARM) {
        selectedVal += " Charm";
    }
    charmChangeCommon(customValue || selectedVal);
    calculateTrapSetup();
}

function showPop() {
    var results = document.querySelector("#results");
    var selectedCharm = $("#charm").val();
    var population = getPopulation(selectedCharm);

    if (!locationName || !cheeseName) {
        results.innerHTML = "";
    } else {
        charmChanged();
        $("#pleaseWaitMessage").show();
        printCombinations(population, getHeader(population));
    }

    /**
     * Build the results table header
     * @param {MousePopulations} population
     * @return {string}
     */
    function getHeader(population) {
        var resultsHeader = "<thead><tr><th align='left'>Setup</th>";
        for (var mouseName in population) {
            resultsHeader += "<th data-filter='false'>" + mouseName + "</th>";
        }
        resultsHeader += "<th id='overallHeader' data-filter='false'>Overall</th></tr></thead>";
        return resultsHeader;
    }
}

/**
 * Get mouse population for current location/phase/cheese and the selected charm
 * @param selectedCharm {string}
 * @return {MousePopulations}
 */
function getPopulation(selectedCharm) {
    var popArrayLPC = popArray[locationName][phaseName][cheeseName];
    if (!popArrayLPC) {
        popArrayLPC = checkPopArray();
    }
    return popArrayLPC[selectedCharm];

    /**
     * Handle cases where cheese names bundled together with '/' between
     * @return {CharmPopulations}
     */
    function checkPopArray() {
        var popArrayL = popArray[locationName][phaseName];
        var cheeseNameKeys = Object.keys(popArrayL);
        var popArrayLLength = Object.size(popArray[locationName][phaseName]);
        var commonCheeseIndex;
        for (var i = 0; i < popArrayLLength; i++) {
            if (cheeseNameKeys[i].indexOf(cheeseName) >= 0 && cheeseNameKeys[i].indexOf("/") >= 0) {
                commonCheeseIndex = cheeseNameKeys[i];
                break;
            }
        }
        return popArray[locationName][phaseName][commonCheeseIndex];
    }
}

/**
 * Builds associative array of chosen power type's effectiveness against the mice population
 * @param micePopulation {MousePopulations}
 * @return {{String:Number}}
 * TODO: Instead of using this mess, use a function that can query it directly?
 */
function buildEffectivenessArray(micePopulation) {
    var eff = {};
    for (var mouse in micePopulation) {
        eff[mouse] = findEff(mouse);
    }
    return eff;
}

/**
 * Builds associative array of mouse powers from current micePopulation
 * @param micePopulation
 * @return {{string:Number}}
 * TODO: Instead of using this mess, use a fucntion that can query it directly.
 */
function buildPowersArray(micePopulation) {
    var power = {};
    for (var mouse in micePopulation) {
        power[mouse] = powersArray[mouse][0];
    }
    return power;
}

/**
 * Build mouse population <td> elements for a setup row
 * @param micePopulation
 * @return {string}
 */
function buildMiceCRCells(micePopulation) {
    var overallCR = 0;
    var overallAR = getCheeseAttraction();
    var effectivenessArray = buildEffectivenessArray(micePopulation);
    var powersArray = buildPowersArray(micePopulation);
    var html = "";

    for (var mouse in micePopulation) {
        var catches = getMouseCatches(micePopulation, mouse, overallAR, effectivenessArray, powersArray);
        overallCR += catches;
        html += "<td align='right'>" + catches.toFixed(2) + "</td>";
    }

    html += "<td>" + overallCR.toFixed(2) + "</td>";
    return html;
}

/**
 * Prints weapon/base combinations for user input
 * @param micePopulation
 * @param headerHtml
 */
function printCombinations(micePopulation, headerHtml) {
    var weaponSelectors = getSelectors("weapon");
    var baseSelectors = getSelectors("base");
    var selectedCharm = document.querySelector("#charm").value;

    var results = $("#results").html(headerHtml);
    var tableHTML = $("<tbody>").appendTo(results);

    charmName = selectedCharm;

    $(weaponSelectors.checkbox + ":checked").each(function(index, weaponElement) {
        weaponName = weaponElement.value;
        weaponChanged(weaponElement.value);

        $(baseSelectors.checkbox + ":checked").each(function(index, baseElement) {
            var rowData = {
                weapon: weaponElement.value,
                base: baseElement.value
            };

            baseName = baseElement.value;
            baseChanged(baseElement.value);

            $("<tr>")
                .append(getLinkCell(selectedCharm, rowData))
                .append(buildMiceCRCells(micePopulation))
                .appendTo(tableHTML);
        });

    });

    handleSort();

    function handleSort() {
        var resort = true;
        var callback = function () {
            var header = $("#overallHeader");
            if (header.hasClass("tablesorter-headerAsc")) {
                header.click();
                header.click();
            }
            else if (header.hasClass("tablesorter-headerUnSorted")) {
                header.click();
            }
        };
        $("#results").trigger("updateAll", [resort, callback]);
    }

    /**
     * Get <td> jquery element for the CRE link
     * @param selectedCharm {string}
     * @param eventData {{string:}} Data to pass tp the 'Find best charm' event listener
     * @return {jQuery}
     */
    function getLinkCell(selectedCharm, eventData) {
        var cell = $("<td/>").append(getCRELinkElement());

        if (selectedCharm === NO_CHARM) {
            $("<span style='float: right'><button class='best-charm'>Find best charm</button></span>")
                .on("click", eventData, findBestCharm)
                .appendTo(cell);
        }

        return cell;
    }

    function findBestCharm(event) {
        console.log("Finding best charm...");
        weaponName = event.data.weapon;
        baseName = event.data.base;
        weaponChanged();
        baseChanged();
        printCharmCombinations(getPopulation(NO_CHARM), headerHtml);
    }

}

/**
 * Creates <a> tag for the CRE link
 * @return {string}
 */
function getCRELinkElement() {
    var urlString = buildCRELink();
    var caption = weaponName + " / " + baseName;
    if (charmName && charmName != NO_CHARM) {
        caption += " / " + charmName;
    }
    return "<a href='" + urlString + "' target='_blank'>" + caption + "</a>";

    /**
     * Builds the actual url with parameter to the CRE page
     * @return {string}
     */
    function buildCRELink() {
        var urlParams = {
            "location": locationName,
            "phase": phaseName,
            "cheese": cheeseName,
            "charm": charmName,
            "gs": !gsLuck,
            "bonusLuck": bonusLuck,
            "weapon": weaponName,
            "base": baseName,
            "toxic": isToxic,
            "battery": batteryPower,
        };
        var urlString = buildURL("cre.html", urlParams);
        urlString = urlString.replace(/'/g, "%27"); //TODO: Verify necessity
        return urlString;
    }
}

/**
 * Gets mouse attraction and catch rate
 * @param micePopulation {{String:Number}} Mouse population percentages for the current location
 * @param mouse {String} Mouse name
 * @param overallAR {Number} Setup attraction rate
 * @param effectivenessArray {Number[]} Power type effectiveness array
 * @param powersArray {Number[]} Mouse powers array
 * @return {{attractions: number, catchRate: number}}
 */
function getMouseACR(micePopulation, mouse, overallAR, effectivenessArray, powersArray) {
    var attractions = micePopulation[mouse] * overallAR;

    if (contains(mouse,"Rook") && charmName === "Rook Crumble Charm") {
        charmBonus += 300;
        calculateTrapSetup();
    }

    var catchRate = calcCR(effectivenessArray[mouse], trapPower, trapLuck, powersArray[mouse]);

    if (contains(mouse, "Rook") && charmName === "Rook Crumble Charm") {
        charmBonus -= 300;
        calculateTrapSetup();
    }

    return {attractions: attractions, catchRate: catchRate};
}

/**
 * Gets the number of catches per 100 hunts
 * @param micePopulation
 * @param mouse {string} Mouse name
 * @param overallAR {Number} Setup attraction rate
 * @param effectivenessArray {Number[]}
 * @param powersArray {Number[]}
 * @return {number} Mouse catches in 100 hunts
 */
function getMouseCatches(micePopulation, mouse, overallAR, effectivenessArray, powersArray) {
    var mouseACDetails = getMouseACR(micePopulation, mouse, overallAR, effectivenessArray, powersArray);
    var attractions = mouseACDetails.attractions;
    var catchRate = mouseACDetails.catchRate;

    if (locationName == "Zugzwang's Tower" || locationName == "Seasonal Garden") {
        if (ztAmp > 0 && weaponName == "Zugzwang's Ultimate Move") {
            catchRate += ((1 - catchRate) / 2);
        }
    }
    //Exceptions, modifications to catch rates
    if (charmName == "Ultimate Charm") catchRate = 1;
    else if (locationName == "Sunken City" && charmName == "Ultimate Anchor Charm" && phaseName != "Docked") catchRate = 1;
    else if (mouse == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
    else if (mouse == "Bounty Hunter" && charmName == "Sheriff's Badge Charm") catchRate = 1;
    else if (mouse == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") catchRate = 0;

    return attractions * catchRate;
}

/**
 * Print result of best charm. (Different charms with specific weapon, base)
 * @param micePopulation {MousePopulations}
 * @param headerHTML {String}
 */
function printCharmCombinations(micePopulation, headerHTML) {
    var tableHTML = $("<tbody>");
    var results = $("#results")
        .html([headerHTML, tableHTML]);
    var charmSelectors = getSelectors("charm");

    $(charmSelectors.checkbox + ":checked").each(function(index, element){
        charmChanged(element.value);
        tableHTML.append("<tr><td>" + getCRELinkElement() + "</td>" + buildMiceCRCells(micePopulation));
    });

    handleSort();

    function handleSort() {
        var resort = true;

        $("#results").trigger("updateAll", [resort, callback]);

        function callback () {
            var header = $("#overallHeader");
            if (header.hasClass("tablesorter-headerAsc") || header.hasClass("tablesorter-headerUnSorted")) {
                $("#overallHeader").click();
            }
        }
    }
}