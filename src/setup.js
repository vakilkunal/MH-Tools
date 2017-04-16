"use strict";


var popArrayLPC, resultsHTML;
var NO_CHARM = "-";

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
 * This one is different in CRE/best setup.
 * TODO: Fix bookmarklet to use encode/decode component for consistency
 */
function getURLParameter(name) {
    return decodeURI(
        (new RegExp(name + "=(.+?)(&|$)").exec(location.search) || [, null])[1]
    );
}

/**
 * Create popArray from population csv response text
 * @param popText {string} CSV Text
 */
function processPop(popText) {
    var i;
    var popCSV = CSVToArray(popText);
    var popCSVLength = popCSV.length;
    popArray = {};

    //Creating popArray
    for (i = 1; i < popCSVLength; i++) {
        processPopItem(i);
    }

    popLoaded = 1;
    checkLoadState();

    function processPopItem(index) {
        var location = popCSV[index][0];
        var phase = popCSV[index][1];
        var cheese = popCSV[index][2];
        var charm = popCSV[index][3];
        var attraction = popCSV[index][4];
        var mouse = popCSV[index][5];

        if (popArray[location] === undefined) {
            popArray[location] = {};
        }
        if (popArray[location][phase] === undefined) {
            popArray[location][phase] = {};
        }
        if (popArray[location][phase][cheese] === undefined) {
            popArray[location][phase][cheese] = {};
        }
        if (popArray[location][phase][cheese][charm] === undefined) {
            popArray[location][phase][cheese][charm] = {};
        }
        popArray[location][phase][cheese][charm][mouse] = parseFloat(attraction);
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
    var i, itemName, inputElement;
    var select = getSelectors(type);
    var checkboxClass = select.checkboxClass;

    for (i = 0; i < itemKeys.length; i++) {
        itemName = itemKeys[i];
        inputElement = "<input type='checkbox' checked" +
            " class='" + checkboxClass + "'" +
            " value='" + itemName + "'" +
            " name='" + select.name + "'>";
        $(select.container).append("<li><label>" +
            inputElement + "&nbsp;" + itemName + "</label></li>");
    }
    $(select.checkbox).change(function () {
        $(select.allCheckbox).prop("checked", false);
    });

    $(select.allCheckbox).change(function () {
        var checked = this.checked;
        $(select.checkbox).prop("checked", checked);
    });
}

/**
 * Start population and baseline loading
 */
function startPopulationLoad() {
    popLoad();
    baselineLoad();

    //TODO: Might as well use Jquery for this.
    function popLoad() {
        var pop = new XMLHttpRequest();
        pop.open("get", POPULATIONS_URL, true);
        pop.onreadystatechange = function () {
            if (pop.readyState === 4) {
                processPop(pop.responseText);
            }
        };
        pop.send();
    }

    function baselineLoad() {
        var baseline = new XMLHttpRequest();
        baseline.open("get", BASELINES_URL, true);
        baseline.onreadystatechange = function () {
            if (baseline.readyState == 4) {
                processBaseline(baseline.responseText);
            }
        };
        baseline.send();
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

        if (savedWeapons.length != weaponKeys.length || savedBases.length != baseKeys.length || savedCharms.length != charmKeys.length) {
            window.alert("New items have been added. Please re-tick what you own, or use the bookmarklet. Sorry for any inconvenience!");
            Cookies.remove("setup");
        } else {
            if (savedWeapons.indexOf(0) >= 0) {
                selectCheckboxes(savedWeapons, "weapon");
            }

            if (savedBases.indexOf(0) >= 0) {
                selectCheckboxes(savedBases, "base");
            }

            if (savedCharms.indexOf(0) >= 0) {
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
            if (ownedItems.indexOf(currentItem) >= 0) {
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
            return decodeURI(parameters[1]).split("/");
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

function loadCheeseDropdown() {
    var option, optionArray;
    var cheeseDropdown = document.querySelector("#cheese");
    var cheeseDropdownHTML = "";

    var insertedCheeses = [];

    for (option in popArray[locationName][phaseName]) {
        if (option.indexOf("/") < 0 || option.indexOf("Combat") >= 0) { //Todo: Fix this master cheese thingy
            cheeseDropdownHTML = addCheeseOption(insertedCheeses, option, cheeseDropdownHTML);
        }
        else {
            splitOption(option);
        }
    }

    cheeseDropdown.innerHTML = cheeseDropdownHTML;
    cheeseDropdown.selectedIndex = 0;
    checkCheeseParam();
    cheeseChanged();

    function splitOption(option) {
        var item, j;
        optionArray = option.split("/");
        for (j = 0; j < Object.size(optionArray); j++) {
            item = optionArray[j];
            cheeseDropdownHTML = addCheeseOption(insertedCheeses, item, cheeseDropdownHTML);
        }
    }

    function checkCheeseParam() {
        var select =document.querySelector("#cheese");
        var cheeseParameter = getURLParameter("cheese");
        if (cheeseParameter != "null" && cheeseLoaded < 3) {
            select.value = cheeseParameter;
        }
    }

    function addCheeseOption(insertedCheeses, cheeseName, cheeseDropdownHTML) {
        if (insertedCheeses.indexOf(cheeseName) < 0) {
            cheeseDropdownHTML += "<option>" + cheeseName + "</option>\n";
            insertedCheeses.push(cheeseName);
        }
        return cheeseDropdownHTML;
    }
}

function populateDropdown(items, elementId) {
    var i;
    var dropdownHtml = "<option>-</option>";
    for (i = 0; i < items.length; i++) {
        if (items[i] != NO_CHARM) {
            dropdownHtml += "<option>" + items[i] + "</option>\n";
        }
    }
    document.getElementById(elementId).innerHTML = dropdownHtml;
}

function loadCharmDropdown() {
    var charms;

    /**
     * Population array for Location-Phase-Cheese
     */
    var popArrayLPC = popArray[locationName][phaseName][cheeseName];

    fillPopArray();

    charms = Object.keys(popArrayLPC);
    charms.sort();
    populateDropdown(charms, "charm");
    checkCharmParameter();

    function checkCharmParameter() {
        var charmParameter = getURLParameter("charm");
        var select =document.querySelector("#charm");
        if (charmParameter != "null") {
            select.value = charmParameter;
            charmChanged(charmParameter);
        }
    }

    function fillPopArray() {
        var popArrayLP, cheese;
        if (!popArrayLPC) {
            popArrayLP = popArray[locationName][phaseName];
            // Search through popArrayLP for cheese matching currently armed cheese
            // TODO: Improve
            for (cheese in popArrayLP) {
                if (cheese.indexOf(cheeseName) >= 0) {
                    popArrayLPC = popArray[locationName][phaseName][cheese];
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
    var weaponsArrayN = weaponsArray[weaponName] || DEFAULT_STATS;

    trapType = weaponsArrayN[0];
    weaponPower = weaponsArrayN[1];
    weaponBonus = weaponsArrayN[2];
    weaponAtt = weaponsArrayN[3];
    weaponLuck = weaponsArrayN[4];
    weaponEff = parseFreshness[weaponsArrayN[5]];

    calculateTrapSetup();
}

function locationChanged() {
    var select =document.querySelector("#location");
    locationName = select.value;

    updateLink();
    showHideWidgets();

    batteryPower = 0;
    ztAmp = 100;

    if (locationName != "") {
        populateSublocationDropdown(locationName);
    }
    phaseChanged();
}

function cheeseChanged() {
    ga("send", "event", "cheese", "changed", cheeseName);

    cheeseName = document.querySelector("#cheese").value;
    updateLink();
    checkToxicWidget();
    loadCharmDropdown();
}

function baseChanged() {
    var charmsArrayN;
    var basesArrayN = basesArray[baseName] || DEFAULT_STATS;

    //Bases with special effects when paired with particular charm
    if (specialCharm[baseName]) {
        calcSpecialCharms(charmName);
    }
    else {
        charmsArrayN = charmsArray[charmName] || DEFAULT_STATS;
        charmPower = parseInt(charmsArrayN[0]);
        charmBonus = parseInt(charmsArrayN[1]);
        charmAtt = parseInt(charmsArrayN[2]);
        charmLuck = parseInt(charmsArrayN[3]);
        charmEff = parseFreshness[charmsArrayN[4]];
    }

    basePower = parseInt(basesArrayN[0]);
    baseBonus = parseInt(basesArrayN[1]);
    baseAtt = parseInt(basesArrayN[2]);
    baseLuck = parseInt(basesArrayN[3]);
    baseEff = parseFreshness[basesArrayN[4]];

    calculateTrapSetup();
}

function charmChanged(charmValue) {
    charmValue = charmValue || $("#charm").val();
    charmChangeCommon(charmValue === NO_CHARM ? charmValue : charmValue + " Charm");
    calculateTrapSetup();
}




function showPop() {
    var results =document.querySelector("#results");
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
     * Handle cases where cheesenames bundled together
     */
    function checkPopArray() {
        var i;
        var popArrayL = popArray[locationName][phaseName];
        var locationKeys = Object.keys(popArrayL);
        var popArrayLLength = Object.size(popArray[locationName][phaseName]);
        var commonCheeseIndex;
        for (i = 0; i < popArrayLLength; i++) {
            if (locationKeys[i].indexOf(cheeseName) >= 0 && locationKeys[i].indexOf("/") >= 0) {
                commonCheeseIndex = locationKeys[i];
                break;
            }
        }
        return popArray[locationName][phaseName][commonCheeseIndex];
    }

    function getHeader(population) {
        var resultsHeader = "<thead><tr><th align='left'>Setup</th>";
        var mouseName;
        for (mouseName in population) {
            resultsHeader += "<th data-filter='false'>" + mouseName + "</th>";
        }
        resultsHeader += "<th id='overallHeader' data-filter='false'>Overall</th></tr></thead>";
        return resultsHeader;
    }

    function getPopulation(selectedCharm) {
        popArrayLPC = popArray[locationName][phaseName][cheeseName];
        if (!popArrayLPC) {
            popArrayLPC = checkPopArray();
        }
        return popArrayLPC[selectedCharm];
    }
}

function buildEffectivenessArray(micePopulation) {
    var mouse;
    var eff = {};
    for (mouse in micePopulation) {
        eff[mouse] = findEff(mouse);
    }
    return eff;
}

function buildPowersArray(micePopulation) {
    var mouse, power = [];
    for (mouse in micePopulation) {
        power[mouse] = powersArray[mouse][0];
    }
    return power;
}

function buildMiceCRHtml(micePopulation) {
    var catches;
    var overallCR = 0;
    var overallAR = getCheeseAttraction();
    var effectivenessArray = buildEffectivenessArray(micePopulation);
    var powersArray = buildPowersArray(micePopulation);
    var html = "";
    var mouse;

    for (mouse in micePopulation) {
        catches = getMouseCatches(micePopulation, mouse, overallAR, effectivenessArray, powersArray);
        overallCR += catches;
        html += "<td align='right'>" + catches.toFixed(2) + "</td>";
    }

    html += "<td>" + overallCR.toFixed(2) + "</td>";
    return html;
}


function printCombinations(micePopulation, headerHtml) {
    var tableHTML = headerHtml + "<tbody>";
    var results =document.querySelector("#results");


    var weaponSelectors = getSelectors("weapon");
    var baseSelectors = getSelectors("base");
    var selectedCharm = document.querySelector("#charm").value;
    if (selectedCharm != NO_CHARM) {
        charmName = selectedCharm + " Charm";
    }

    $(weaponSelectors.checkbox + ":checked").each(function(index, element) {
        weaponName = element.value;
        weaponChanged();

        $(baseSelectors.checkbox + ":checked").each(function(index, element) {
            var linkElement;
            baseName = element.value;
            baseChanged();

            linkElement = getCRELinkElement();
            if (selectedCharm == NO_CHARM) {
                linkElement += "<span style='float: right'><button class='find_best_charm_button'>Find best charm</button></span>";
            }
            tableHTML += "<tr><td>" + linkElement + "</td>" + buildMiceCRHtml(micePopulation) + "</tr>" ;
        });
    });

    tableHTML += "</tbody>";
    results.innerHTML = tableHTML;

    $(".find_best_charm_button").click(function (event) {
        var weaponBase = event.target.parentNode.previousSibling.innerHTML;
        var indexOfSlash = weaponBase.indexOf(" / ");
        console.log("Finding best charm...");
        weaponName = weaponBase.slice(0, indexOfSlash);
        baseName = weaponBase.substr(indexOfSlash + 3);
        weaponChanged();
        baseChanged();
        printCharmCombinations(popArrayLPC[NO_CHARM], headerHtml);
    });

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

function getCRELinkElement() {
    var urlString = buildCRELink();
    var caption = weaponName + " / " + baseName;
    if (charmName && charmName != NO_CHARM) {
        caption += " / " + charmName;
    }
    return "<a href='" + urlString + "' target='_blank'>" + caption + "</a>";
}

function getMouseACR(micePopulation, mouse, overallAR, eff, power) {
    var attractions = parseFloat(micePopulation[mouse]) * overallAR;

    if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
        charmBonus += 300;
        calculateTrapSetup();
    }
    var catchRate = calcCR(eff[mouse], trapPower, trapLuck, power[mouse]);

    if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
        charmBonus -= 300;
        calculateTrapSetup();
    }
    return {attractions: attractions, catchRate: catchRate};
}

function buildCRELink() {
    var urlString;
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
    urlString = buildURL("cre.html", urlParams);
    urlString = urlString.replace(/'/g, "%27"); //TODO: Verify necessity
    return urlString;
}

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

function printCharmCombinations(micePopulation, tableHTML) {
    var results = document.querySelector("#results");
    var charmSelectors = getSelectors("charm");


    $(charmSelectors.checkbox + ":checked").each(function(index, element){
        charmChanged(element.value);
        tableHTML += "<tr><td>" + getCRELinkElement() + "</td>" + buildMiceCRHtml(micePopulation);
    });

    tableHTML += "</tbody>";
    results.innerHTML = tableHTML;

    var resort = true, callback = function () {
            var header = $("#overallHeader");
            if (header.hasClass("tablesorter-headerAsc") || header.hasClass("tablesorter-headerUnSorted")) {
                $("#overallHeader").click();
            }
    };
    $("#results").trigger("updateAll", [resort, callback]);
}