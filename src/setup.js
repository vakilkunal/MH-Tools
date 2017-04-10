"use strict";

var d, popArrayLPC, resultsHTML;

function checkLoadState() {
    var loadPercentage = (popLoaded + baselineLoaded) / 2 * 100;
    var status = document.getElementById("status")
    status.innerHTML = "<td>Loaded " + loadPercentage + "%...</td>";

    if (loadPercentage == 100) {
        loadLocationDropdown();
        //loadTourneyDropdown();
        //updateLink();

        checkToxicParam();

        var batteryParameter = getURLParameter("battery");
        if (batteryParameter != "null") {
            var select = document.getElementById("battery");
            select.value = parseInt(batteryParameter);
        }

        status.innerHTML = "<td>All set!</td>";
        setTimeout(function () {
            status.innerHTML = '<td><br></td>'
        }, 3000);
    }
}

var popCSV = [];
var popArray = [];

/**
 * This one is different in CRE/best setup.
 */
function getURLParameter(name) {
    return decodeURI(
        (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

function processPop(popText) {


    popCSV = CSVToArray(popText);

    var popCSVLength = Object.size(popCSV);

    //Creating popArray
    for (var i = 1; i < popCSVLength; i++) {
        if (popArray[popCSV[i][0]] == undefined) popArray[popCSV[i][0]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] = [];
        popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);
    }

    popLoaded = 1;
    checkLoadState();
}

/**
 * Get Jquery selectors for a specific type
 * @param type {string} 'weapon', 'base' or 'charm'
 * @returns {{checkbox: string, container: string, allCheckbox: string}}
 */
function getSelectors(type) {
    var checkboxSelector = "." + type + "_checkbox";
    var containerSelector = "#" + type + "s_selector_table";
    var allCheckbox = "#all_" + type + "s_checkbox";
    return {
        checkbox: checkboxSelector,
        container: containerSelector,
        allCheckbox: allCheckbox
    };
}

/**
 * Populates item checkboxes
 * @param itemKeys {string[]}
 * @param type {string} @see {@link getSelectors}
 */
function loadItemSelection(itemKeys, type) {
    var select = getSelectors(type);
    var checkboxClass = select.checkbox.substring(1);

    for (var i = 0; i < itemKeys.length; i++) {
        var itemName = itemKeys[i];
        var inputElement = "<input type='checkbox' checked" +
            " class='" + checkboxClass + "'" +
            " value='" + itemName + "'" +
            " name='" + type + "-owned'>";
        $(select.container).append("<li><label>" +
            inputElement + "&nbsp;" + itemName + "</label></li>");
    }
    $(select.checkbox).change(function () {
        $(select.allCheckbox).prop('checked', false);
    });

    $(select.allCheckbox).change(function () {
        var checked = this.checked;
        $(select.checkbox).prop('checked', checked);
    });
}

function startPopulationLoad() {
    var pop = new XMLHttpRequest();
    pop.open("get", POPULATIONS_URL, true);
    pop.onreadystatechange = function () {
        if (pop.readyState == 4) {
            processPop(pop.responseText);
        }
    };
    pop.send();

    var baseline = new XMLHttpRequest();
    baseline.open("get", BASELINES_URL, true);
    baseline.onreadystatechange = function () {
        if (baseline.readyState == 4) {
            processBaseline(baseline.responseText);
        }
    };
    baseline.send();
}
function checkCookies() {
    function loadOwnedCookie(setupCookie) {
        var savedSetup = JSON.parse(setupCookie);
        var savedWeapons = savedSetup['weapons'] || [];
        var savedBases = savedSetup['bases'] || [];
        var savedCharms = savedSetup['charms'] || [];

        if (savedWeapons.length != weaponKeys.length || savedBases.length != baseKeys.length || savedCharms.length != charmKeys.length) {
            window.alert("New items have been added. Please re-tick what you own, or use the bookmarklet. Sorry for any inconvenience!");
            Cookies.remove('setup');
        } else {
            //Unticks 'All' if there was an unticked box stored in the cookie
            if (savedWeapons.indexOf(0) >= 0) {
                $("#all_weapons_checkbox").prop('checked', false);
                for (var i = 0; i < savedWeapons.length; i++) {
                    $(".weapon_checkbox").get(i).checked = savedWeapons[i];
                }
            }

            if (savedBases.indexOf(0) >= 0) {
                $("#all_bases_checkbox").prop('checked', false);
                for (var i = 0; i < savedBases.length; i++) {
                    $(".base_checkbox").get(i).checked = savedBases[i];
                }
            }

            if (savedCharms.indexOf(0) >= 0) {
                $("#all_charms_checkbox").prop('checked', false);
                for (var i = 0; i < savedCharms.length; i++) {
                    $(".charm_checkbox").get(i).checked = savedCharms[i];
                }
            }
        }
    }

    function processStorageArray(indexArray, ownedItems, type) {
        var selectors = getSelectors(type);

        $(selectors.checkbox).prop("checked", false);
        $(selectors.allCheckbox).prop('checked', false);
        for (var i = 0; i < indexArray.length; i++) {
            var currentItem = indexArray[i];
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

    var storedData = JSON.parse(localStorage.getItem("setupData"));
    if (storedData) {
        processStoredData(storedData);
    } else if(Cookies.get('setup')) {
        loadOwnedCookie(Cookies.get('setup'))
    }
}

function loadURLData() {

    function getDataFromURL(parameters) {
        if (parameters) {
            parameters = decodeURI(parameters[1]);
            return parameters.split('/');
        } else {
            return [];
        }
    }

    function processUrlData(urlItemArray, type) {
        var dataObject = {};
        var storedData = localStorage.getItem("setupData");
        if (storedData != null) {
            dataObject = JSON.parse(storedData);
        }

        if (type == "bases" || type == "weapons" || type == "charms") {
            if (dataObject[type] == undefined) {
                dataObject[type] = [];
            }
            var dataLen = urlItemArray.length - 1;
            var ownedItemArray = dataObject[type];
            for (var i = 0; i < dataLen; i++) {
                var itemName = urlItemArray[i];
                if (ownedItemArray.indexOf(itemName) < 0) {
                    ownedItemArray.push(itemName);
                }
            }
        }

        if (Object.size(dataObject) > 0) {
            localStorage.setItem("setupData", JSON.stringify(dataObject));
            window.location.replace("setupwaiting.html");
        }
    }

    var urlBases = getDataFromURL(window.location.search.match(/bases=([^&]*)/));
    var urlWeapons = getDataFromURL(window.location.search.match(/weapons=([^&]*)/));
    var urlCharms = getDataFromURL(window.location.search.match(/charms=([^&]*)/));

    /**
     * Only process pop if no more weapons/charms/bases need to be loaded.
     */
    if (urlBases.length == 0 && urlWeapons.length == 0 && urlCharms.length == 0) {
        return true;
    }
    else if (urlBases.length > 0) {
        processUrlData(urlBases, "bases");
    }
    else if (urlWeapons.length > 0) {
        processUrlData(urlWeapons, "weapons");
    }
    else if (urlCharms.length > 0) {
        processUrlData(urlCharms, "charms");
    }
    return false;
}

function initTableSorter() {
//Initialize tablesorter, bind to table
    $.tablesorter.defaults.sortInitialOrder = 'desc';
    $("#results").tablesorter({
        // sortForce: [[noMice,1]],
        sortReset: true,
        widthFixed: true,
        ignoreCase: false,
        widgets: ["filter", "pager"],
        widgetOptions: {
            filter_childRows: false,
            filter_childByColumn: false,
            filter_childWithSibs: true,
            filter_columnFilters: true,
            filter_columnAnyMatch: true,
            filter_cellFilter: '',
            filter_cssFilter: '', // or []
            filter_defaultFilter: {},
            filter_excludeFilter: {},
            filter_external: '',
            filter_filteredRow: 'filtered',
            filter_formatter: null,
            filter_functions: null,
            filter_hideEmpty: true,
            filter_hideFilters: true,
            filter_ignoreCase: true,
            filter_liveSearch: true,
            filter_matchType: {'input': 'exact', 'select': 'exact'},
            filter_onlyAvail: 'filter-onlyAvail',
            filter_placeholder: {search: 'Filter results...', select: ''},
            filter_reset: 'button.reset',
            filter_resetOnEsc: true,
            filter_saveFilters: false,
            filter_searchDelay: 420,
            filter_searchFiltered: true,
            filter_selectSource: null,
            filter_serversideFiltering: false,
            filter_startsWith: false,
            filter_useParsedData: false,
            filter_defaultAttrib: 'data-value',
            filter_selectSourceSeparator: '|',
            pager_output: '{startRow:input} to {endRow} of {totalRows} rows', // '{page}/{totalPages}'
            pager_updateArrows: true,
            pager_startPage: 0,
            pager_size: 10,
            pager_savePages: false,
            pager_fixedHeight: false,
            pager_removeRows: false, // removing rows in larger tables speeds up the sort
            pager_ajaxUrl: null,
            pager_customAjaxUrl: function (table, url) {
                return url;
            },
            pager_ajaxError: null,
            pager_ajaxObject: {
                dataType: 'json'
            },
            pager_ajaxProcessing: function (ajax) {
                return [0, [], null];
            },

            // css class names that are added
            pager_css: {
                container: 'tablesorter-pager',    // class added to make included pager.css file work
                errorRow: 'tablesorter-errorRow', // error information row (don't include period at beginning); styled in theme file
                disabled: 'disabled'              // class added to arrows @ extremes (i.e. prev/first arrows "disabled" on first page)
            },

            // jQuery selectors
            pager_selectors: {
                container: '.pager',       // target the pager markup (wrapper)
                first: '.first',       // go to first page arrow
                prev: '.prev',        // previous page arrow
                next: '.next',        // next page arrow
                last: '.last',        // go to last page arrow
                gotoPage: '.gotoPage',    // go to page selector - select dropdown that sets the current page
                pageDisplay: '.pagedisplay', // location of where the "output" is displayed
                pageSize: '.pagesize'     // page size selector - select dropdown that sets the "size" option
            }
        }
    }).bind('pagerChange pagerComplete pagerInitialized pageMoved', function (e, c) {
        var p = c.pager, // NEW with the widget... it returns config, instead of config.pager
            msg = '"</span> event triggered, ' + (e.type === 'pagerChange' ? 'going to' : 'now on') +
                ' page <span class="typ">' + (p.page + 1) + '/' + p.totalPages + '</span>';
        $('#display')
            .append('<li><span class="str">"' + e.type + msg + '</li>')
            .find('li:first').remove();
    });
}

window.onload = function () {
    user = "setup";

    //Instructions
    $("#instructions").click(function () {
        var instructionString = "Drag the blue 'Best Setup' link to your bookmarks bar if possible. If that doesn't work, try the manual steps below.\n\n";
        instructionString += "Google Chrome:\n- Bookmark a random page and name it 'Best Setup Bookmarklet'"
        instructionString += "\n- Copy the bookmarklet code by right-clicking the 'Best Setup' link and selecting 'Copy link address...'"
        instructionString += "\n- Right click the newly created bookmark and select 'Edit...'"
        instructionString += "\n- Paste into the 'URL' field\n\n";
        instructionString += "Firefox:\n- Right click the 'Best Setup' link and select 'Bookmark This Link'\n\n";
        instructionString += "Internet Explorer:\n- Right click the 'Best Setup' link and select 'Add to favorites...'\n\n";
        instructionString += "Mobile/Other Browsers:\n- Same concept as above. Processes may vary";
        alert(instructionString);
    });

    //Bookmarklet storage logic
    if (setupBookmarkletString != localStorage.getItem('setupBookmarklet')) {
        alert("Bookmarklet has changed! Please update accordingly.");
        localStorage.setItem('setupBookmarklet', setupBookmarkletString);
    }
    $("#bookmarklet").attr("href", setupBookmarkletString);
    $("#slowBookmarklet").attr("href", setupBookmarkletString.replace(/=500/g, "=2500"));
    $("#evenslowerBookmarklet").attr("href", setupBookmarkletString.replace(/=500/g, "=6000"));


    initTableSorter();

    loadItemSelection(weaponKeys, "weapon");
    loadItemSelection(baseKeys, "base");
    loadItemSelection(charmKeys, "charm");

    var done = loadURLData();
    if (done) {
        checkCookies();
        startPopulationLoad();
        $("#main").show(500);
    }
    gsParamCheck();

    var bonusLuckParameter = parseInt(getURLParameter("bonusLuck"));
    if (bonusLuckParameter >= 0) {
        document.getElementById("bonusLuck").value = bonusLuckParameter;
        bonusLuckChanged();
    }

    showHideWidgets();

    document.getElementById("location").onchange = locationChanged;
    document.getElementById("phase").onchange = phaseChanged;
    document.getElementById("cheese").onchange = cheeseChanged;
    document.getElementById("charm").onchange = charmChanged;
    document.getElementById("toxic").onchange = toxicChanged;
    document.getElementById("battery").onchange = batteryChanged;
    document.getElementById("gs").onchange = gsChanged;
    document.getElementById("bonusLuck").onchange = bonusLuckChanged;

    $("#save_setup_button").click = saveSetupCookie;

    $("#show_pop_button").click(function () {
        $("#pleaseWaitMessage").show();
        setTimeout(showPop, 1);
    });

    $("#show_weapons_button").click(function () {
        $("#weapons_selector_table").toggle();
        $("#bases_selector_table").hide();
        $("#charms_selector_table").hide();
    });

    $("#show_bases_button").click(function () {
        $("#bases_selector_table").toggle();
        $("#weapons_selector_table").hide();
        $("#charms_selector_table").hide();
    });

    $("#show_charms_button").click(function () {
        $("#charms_selector_table").toggle();
        $("#weapons_selector_table").hide();
        $("#bases_selector_table").hide();
    });

    $("#results").bind("sortStart", function () {
        $("#pleaseWaitMessage").show();
    }).bind("sortEnd", function () {
        $("#pleaseWaitMessage").hide();
    });
};

function saveSetupCookie() {

    /**
     * Builds array of 1's and 0's from selected checkboxes
     * @param selector {string}
     * @returns Number[]
     */
    function getCookieArray(selector) {
        return $(selector).map(function () {
            return Number($(this).prop('checked'))
        }).toArray();
    }

    var checkedWeapons = getCookieArray(getSelectors('weapon').checkbox);
    var checkedBases = getCookieArray(getSelectors('base').checkbox);
    var checkedCharms = getCookieArray(getSelectors('charm').checkbox);

    var cvalue = {
        weapons : checkedWeapons,
        bases : checkedBases,
        charms :  checkedCharms
    };

    Cookies.set('setup', cvalue, {
        expires: 365
    }); //expires in a year
}



function loadCheeseDropdown() {
    var cheeseDropdown = document.getElementById("cheese");
    var cheeseDropdownHTML = '';

    var cheeseLength = Object.size(popArray[locationName][phaseName]);
    var insertedCheeses = [];

    for (var i = 0; i < cheeseLength; i++) {
        var option = Object.keys(popArray[locationName][phaseName])[i];
        if (option.indexOf("/") < 0 || option.indexOf("Combat") >= 0) { //Fix this master cheese thingy
            if (insertedCheeses.indexOf(option) < 0) {
                cheeseDropdownHTML += "<option>" + option + "</option>\n";
                insertedCheeses.push(option);
            }
        }
        else {
            var optionArray = option.split("/");
            var optionArrayLength = Object.size(optionArray);
            for (var j = 0; j < optionArrayLength; j++) {
                var item = optionArray[j];
                if (insertedCheeses.indexOf(item) < 0) {
                    cheeseDropdownHTML += "<option>" + item + "</option>\n";
                    insertedCheeses.push(item);
                }
            }
        }
    }

    cheeseDropdown.innerHTML = cheeseDropdownHTML;

    var cheeseParameter = getURLParameter("cheese");
    if (cheeseParameter != "null" && cheeseLoaded < 3) {
        var select = document.getElementById("cheese");
        select.value = cheeseParameter;
    }

    cheeseChanged();
}

function loadCharmDropdown() {

    /**
     * Population array for Location-Phase-Cheese
     */
    var popArrayLPC = popArray[locationName][phaseName][cheeseName];
    if (!popArrayLPC) {
        var popArrayLP = popArray[locationName][phaseName];
        // Search through popArrayLP for cheese matching currently armed cheese
        // TODO: Improve
        for (var cheese in popArrayLP) {
            if (cheese.indexOf(cheeseName) >= 0) {
                popArrayLPC = popArray[locationName][phaseName][cheese];
            }
        }
    }

    var charmDropdown = document.getElementById("charm");
    var charmDropdownHTML = '<option>-</option>';
    var charms = Object.keys(popArrayLPC);
    charms.sort();
    var nSpecialCharms = charms.length;
    for (var i = 0; i < nSpecialCharms; i++) {
        if (charms[i] != "-") {
            charmDropdownHTML += "<option>" + charms[i] + "</option>\n";
        }
    }

    charmDropdown.innerHTML = charmDropdownHTML;

    var charmParameter = getURLParameter("charm");
    if (charmParameter != "null") {
        var select = document.getElementById("charm");
        select.value = charmParameter;
        charmChanged();
    }
}

//TODO: Improve Link Builder. See CRE.
function updateLink() {

    var select = document.getElementById("charm");
    var selectedCharm = select.children[select.selectedIndex].innerHTML;

    urlParams = {
        "location" : locationName,
        "phase" : phaseName,
        "cheese" : cheeseName,
        "charm" : selectedCharm,
        "toxic" : isToxic,
        "battery" : batteryPower,
        "gs" : !gsLuck,
        "bonusLuck" : bonusLuck,
        "tourney" : tournamentName,
    };

    var URLString = buildURL('setup.html',urlParams);
    document.getElementById("link").href = URLString;

    ga('send', 'event', 'link', 'updated', URLString);
}

function weaponChanged() {
    var weaponsArrayN = weaponsArray[weaponName];
    if (weaponsArrayN == undefined) weaponsArrayN = [0];

    trapType = weaponsArrayN[0];
    weaponPower = weaponsArrayN[1];
    weaponBonus = weaponsArrayN[2];
    weaponAtt = weaponsArrayN[3];
    weaponLuck = weaponsArrayN[4];
    weaponEff = parseFreshness[weaponsArrayN[5]];

    calculateTrapSetup();
}

function locationChanged() {
    var select = document.getElementById("location");
    locationName = select.children[select.selectedIndex].innerHTML;
    updateLink();

    showHideWidgets();

    batteryPower = 0;
    ztAmp = 100;

    //showPop(0);

    //Populate sublocation dropdown and select first option
    if (locationName != "") {
        populateSublocationDropdown(locationName);
    }

}

function cheeseChanged() {
    var select = document.getElementById("cheese");
    cheeseName = select.children[select.selectedIndex].innerHTML;
    ga('send', 'event', 'cheese', 'changed', cheeseName);
    //ga('send', 'event', 'charm', 'selected', charmName);
    updateLink();

    //Toxic checks
    checkToxicWidget();

    //showPop();
    //selectCharm();
    loadCharmDropdown();
}

function baseChanged() {
    //updateLink();

    var basesArrayN = basesArray[baseName];
    if (basesArrayN == undefined) basesArrayN = [0];

    //Bases with special effects when paired with particular charm
    if (specialCharm[baseName]) calcSpecialCharms(charmName);
    else {
        var charmsArrayN = charmsArray[charmName] || [0, 0, 0, 0, "No Effect"];

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

function charmChanged() {
    charmChangeCommon();
    calculateTrapSetup();
}

function showPop(type) {
    d = new Date();
    //console.log("Showing pop (" + type + ")");
    var results = document.getElementById("results");

    if (locationName == '' || cheeseName == '' || type == 0) {
        results.innerHTML = ''
    } else {
	    $("#pleaseWaitMessage").show();

        popArrayLPC = popArray[locationName][phaseName][cheeseName];
        //For common cheeses e.g. gouda, brie etc.
        if (popArrayLPC == undefined && cheeseName != "Cheese") {
            var popArrayL = popArray[locationName][phaseName];
            var popArrayLLength = Object.size(popArray[locationName][phaseName]);
            var commonCheeseIndex;
            for (var i = 0; i < popArrayLLength; i++) {
                if (Object.keys(popArrayL)[i].indexOf(cheeseName) >= 0 && Object.keys(popArrayL)[i].indexOf("/") >= 0) {
                    commonCheeseIndex = Object.keys(popArrayL)[i];
                    break;
                }
            }
            popArrayLPC = popArray[locationName][phaseName][commonCheeseIndex];
        }

        //console.log(popArrayLC);

        var select = document.getElementById("charm");
        var selectedCharm = select.children[select.selectedIndex].innerHTML;

        var noMice = Object.size(popArrayLPC[selectedCharm]);
        resultsHTML = "<thead><tr><th align='left'>Setup</th>"
        for (var i = 0; i < noMice; i++) {
            resultsHTML += "<th data-filter='false'>" + Object.keys(popArrayLPC[selectedCharm])[i] + "</th>"
        }
        resultsHTML += "<th id='overallHeader' data-filter='false'>Overall</th></tr></thead><tbody>";

        printCombinations(popArrayLPC[selectedCharm], resultsHTML);
    }
}

function printCombinations(micePopulation, tableHTML) {
    var results = document.getElementById("results");

    var noMice = Object.size(micePopulation) + 1;
    //console.log(noMice);

    var power = [];
    for (var mouse in micePopulation) {
        power[mouse] = powersArray[mouse][0]
    }


    var nWeapons = weaponKeys.length;
    var nBases = baseKeys.length;

    for (var i = 0; i < nWeapons; i++) {
        if (!$(".weapon_checkbox").get(i).checked) continue;

        var weapon = weaponKeys[i];
        weaponName = weapon;
        weaponChanged();

        var eff = [];
        for (var mouse in micePopulation) {
            eff[mouse] = findEff(mouse)
        }


        for (var j = 0; j < nBases; j++) {
            if (!$(".base_checkbox").get(j).checked) continue;
            var base = baseKeys[j];
            baseName = base;
            baseChanged();
            //console.log(weapon + base);

            var overallAR = getCheeseAttraction();
            var overallCR = 0;
            var select = document.getElementById("charm");
            var selectedCharm = select.children[select.selectedIndex].innerHTML;
            if (selectedCharm != "-") {
                charmName = selectedCharm + " Charm";
            }
            var urlParams = {
                "location": locationName,
                "phase": phaseName,
                "cheese": cheeseName,
                "charm": charmName,
                "gs": !gsLuck,
                "bonusLuck": bonusLuck,
                "weapon": weapon,
                "base": base,
                "toxic": isToxic,
                "battery": batteryPower,
            };
            var URLString = buildURL('cre.html', urlParams);
            URLString = URLString.replace(/'/g, "%27");

            //console.log(URLString);

            if (selectedCharm == "-") {
                tableHTML += "<tr><td><a href='" + URLString + "' target='_blank'>" + weapon + " / " + base + "</a><span style='float: right'><button class='find_best_charm_button'>Find best charm</button></span></td>";
            }
            else {
                tableHTML += "<tr><td><a href='" + URLString + "' target='_blank'>" + weapon + " / " + base + "</td>";
            }

            for (var mouse in micePopulation) {

                var attractions = parseFloat(micePopulation[mouse]) * overallAR;

                if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
                    charmBonus += 300;
                    calculateTrapSetup();
                }
                var catchRate = calcCR(eff[mouse], trapPower, trapLuck, power[mouse]);
                //console.log("CR: " + catchRate);
                //console.log(power[mouse]);

                if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
                    charmBonus -= 300;
                    calculateTrapSetup();
                }
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
                else if (mouse == "Zurreal the Eternal" && weapon != "Zurreal's Folly") catchRate = 0;

                var catches = attractions * catchRate;
                overallCR += catches;
                catches = catches.toFixed(2);

                tableHTML += "<td align='right'>" + catches + "</td>";

            }

            overallCR = overallCR.toFixed(2);
            tableHTML += "<td>" + overallCR + "</td></tr>";
        }
    }

    tableHTML += "</tbody>";
    results.innerHTML = tableHTML;

    $(".find_best_charm_button").click(function (event) {
        console.log("Finding best charm...");
        var weaponBase = event.target.parentNode.previousSibling.innerHTML;
        var indexOfSlash = weaponBase.indexOf(" / ");
        weaponName = weaponBase.slice(0, indexOfSlash);
        baseName = weaponBase.substr(indexOfSlash + 3);
        weaponChanged();
        baseChanged();
        d = new Date();
        printCharmCombinations(popArrayLPC["-"], resultsHTML);
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

    // console.log(new Date().getTime()-d.getTime());
}

function printCharmCombinations(micePopulation, tableHTML) {
    var results = document.getElementById("results");

    var noMice = Object.size(micePopulation) + 1;
    //console.log(noMice);

    var power = [];
    for (var mouse in micePopulation) {
        power[mouse] = powersArray[mouse][0];
    }


    var nCharms = charmKeys.length;
    for (var i = 0; i < nCharms; i++) {
        if (!$(".charm_checkbox").get(i).checked) continue;

        charmName = charmKeys[i];
        charmChanged();

        var eff = [];
        for (var mouse in micePopulation) {
            eff[mouse] = findEff(mouse)
        }

        var overallAR = getCheeseAttraction();
        var overallCR = 0;

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
        var URLString = buildURL('cre.html', urlParams);
        URLString = URLString.replace(/'/g, "%27");

        tableHTML += "<tr><td><a href='" + URLString + "' target='_blank'>" + weaponName + " / " + baseName + " / " + charmName + "</a><span style='float: right'></span></td>";

        for (var mouse in micePopulation) {

            var attractions = parseFloat(micePopulation[mouse]) * overallAR;


            if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
                charmBonus += 300;
                calculateTrapSetup();
            }
            var catchRate = calcCR(eff[mouse], trapPower, trapLuck, power[mouse]);
            //console.log("CR: " + catchRate);
            //console.log(power[mouse]);
            if (mouse.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
                charmBonus -= 300;
                calculateTrapSetup();
            }

            //Exceptions, modifications to catch rates
            if (charmName == "Ultimate Charm") catchRate = 1;
            else if (mouse == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
            else if (mouse == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") catchRate = 0;

            var catches = attractions * catchRate;
            overallCR += catches;
            catches = catches.toFixed(2);

            tableHTML += "<td align='right'>" + catches + "</td>";

        }

        overallCR = overallCR.toFixed(2);
        tableHTML += "<td>" + overallCR + "</td></tr>";
    }
    //tableHTML.innerHTML += "<tr><td>" + "Maniacal" + "</td></tr>";


    tableHTML += "</tbody>"
    results.innerHTML = tableHTML

    var resort = true, callback = function () {
        var header = $("#overallHeader");
        if (header.hasClass("tablesorter-headerAsc") || header.hasClass("tablesorter-headerUnSorted")) {
            $("#overallHeader").click();
        }
    };
    $("#results").trigger("updateAll", [resort, callback]);

    // console.log(new Date().getTime()-d.getTime());
}