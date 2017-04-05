"use strict";

var d, popArrayLPC, resultsHTML;


//TODO pass arguments to processX() functions instead of using global variables
//TODO load XMLHttpRequests within a function so reduce global variables

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

function processPop() {
    var popText = pop.responseText;

    popCSV = CSVToArray(popText);
    //console.log(popCSV);

    var popCSVLength = Object.size(popCSV);
    //console.log("popCSVLength", popCSVLength);

    //Creating popArray
    for (var i = 1; i < popCSVLength; i++) {
        if (popArray[popCSV[i][0]] == undefined) popArray[popCSV[i][0]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] = [];
        popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);
    }

    //console.log(popArray);

    popLoaded = 1;
    checkLoadState();
}


function getDataFromURL(parameters) {
    if (parameters) {
        parameters = decodeURI(parameters[1]);

        return parameters
            .split('/');
    } else {
        return [];
    }
}


function loadWeaponSelection() {
    var len = weaponKeys.length;
    for (var i = 0; i < len; i++) {
        $("#weapons_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='weapon_checkbox' checked>&nbsp" + weaponKeys[i] + "</td></tr>");
    }

    $(".weapon_checkbox").change(function () {
        $("#all_weapons_checkbox").prop('checked', false);
    });
}

function loadBaseSelection() {
    var len = baseKeys.length;
    for (var i = 0; i < len; i++) {
        $("#bases_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='base_checkbox' checked>&nbsp" + baseKeys[i] + "</td></tr>");
    }
    $(".base_checkbox").change(function () {
        $("#all_bases_checkbox").prop('checked', false);
    });
}

function loadCharmSelection() {
    var len = charmKeys.length;
    for (var i = 0; i < len; i++) {

        $("#charms_selector_table").append("<tr><td style='padding:0'><input type='checkbox' class='charm_checkbox' checked>&nbsp" + charmKeys[i] + "</td></tr>");
    }
    $(".charm_checkbox").change(function () {
        $("#all_charms_checkbox").prop('checked', false);
    });
}

var pop = new XMLHttpRequest();
var baseline = new XMLHttpRequest();

window.onload = function () {
    user = "setup";

    // if (location.href.indexOf("https") < 0) {
    // 	var currLoc = location.href;
    // 	currLoc = currLoc.replace("http", "https");
    // 	location.href = currLoc;
    // }

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
    // Hacky, use more precise "SUBMIT_DELAY" replacement

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

    loadWeaponSelection();
    loadBaseSelection();
    loadCharmSelection();

    //Load in data from URL
    var rawBases = getDataFromURL(window.location.search.match(/bases=([^&]*)/));
    var rawWeapons = getDataFromURL(window.location.search.match(/weapons=([^&]*)/));
    var rawCharms = getDataFromURL(window.location.search.match(/charms=([^&]*)/));

    /**
     * Only process pop if no more weapons/charms/bases need to be loaded.
     */
    if (rawBases.length == 0 && rawWeapons.length == 0 && rawCharms.length == 0) {
        checkCookies();
        pop.open("get", POPULATIONS_URL, true);
        pop.onreadystatechange = function () {
            if (pop.readyState == 4) {
                processPop();
            }
        };
        pop.send();
        baseline.open("get", BASELINES_URL, true);
        baseline.onreadystatechange = function () {
            if (baseline.readyState == 4) {
                //console.log(baseline.responseText);
                processBaseline(baseline.responseText);
            }
        };
        baseline.send();

        $("#main").show(500);
    }
    else if (rawBases.length > 0) {
        processRawData(rawBases, "bases");
    }
    else if (rawWeapons.length > 0) {
        processRawData(rawWeapons, "weapons");
    }
    else if (rawCharms.length > 0) {
        processRawData(rawCharms, "charms");
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
    document.getElementById("gs").onchange =  gsChanged;
    document.getElementById("bonusLuck").onchange = bonusLuckChanged;

    $("#save_setup_button").click(function () {
        saveSetupCookie();
    });

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

    $("#all_weapons_checkbox").change(function () {
        if (this.checked) $(".weapon_checkbox").each(function () {
            this.checked = true;
        });
        else $(".weapon_checkbox").each(function () {
            this.checked = false;
        });
    });
    $("#all_bases_checkbox").change(function () {
        if (this.checked) $(".base_checkbox").each(function () {
            this.checked = true;
        });
        else $(".base_checkbox").each(function () {
            this.checked = false;
        });
    });
    $("#all_charms_checkbox").change(function () {
        if (this.checked) $(".charm_checkbox").each(function () {
            this.checked = true;
        });
        else $(".charm_checkbox").each(function () {
            this.checked = false;
        });
    })
};

function saveSetupCookie() {
    var checkedWeapons = [];
    var checkedBases = [];
    var checkedCharms = [];

    for (var i = 0; i < weaponKeys.length; i++) {
        if ($(".weapon_checkbox").get(i).checked) {
            checkedWeapons.push(1);
        } else checkedWeapons.push(0);
    }
    for (var i = 0; i < baseKeys.length; i++) {
        if ($(".base_checkbox").get(i).checked) {
            checkedBases.push(1);
        } else checkedBases.push(0);
    }
    for (var i = 0; i < charmKeys.length; i++) {
        if ($(".charm_checkbox").get(i).checked) {
            checkedCharms.push(1);
        } else checkedCharms.push(0);
    }

    //cvalue is an object of 3 arrays, where each is of int strings (either 1 for checked or 0 for not)
    var cvalue = {};
    cvalue['weapons'] = checkedWeapons;
    cvalue['bases'] = checkedBases;
    cvalue['charms'] = checkedCharms;

    Cookies.set('setup', cvalue, {
        expires: 365,
        path: '/'
    }); //expires in a year
}

function processRawData(rawDataArray, type) {
    var dataObject = {};
    var storedData = localStorage.getItem("setupData");
    if (storedData != null) {
        dataObject = JSON.parse(storedData);
    }

    if (type == "bases" || type == "weapons" || type == "charms") {
        if (dataObject[type] == undefined) {
            dataObject[type] = [];
        }
        var dataLen = rawDataArray.length - 1;
        var dataSplit = rawDataArray;
        for (var i = 0; i < dataLen; i++) {
            if (dataObject[type].indexOf(dataSplit[i]) < 0) {
                dataObject[type].push(dataSplit[i]);
            }
        }
    }

    if (Object.size(dataObject) > 0) {
        localStorage.setItem("setupData", JSON.stringify(dataObject));
        window.location.replace("setupwaiting.html");
        // window.location.replace("https://localhost:8888/setupwaiting.html"); //debug
    }
}

function checkCookies() {
    var storedData = {};
    var bases = [];
    var weapons = [];
    var charms = [];
    if (localStorage.getItem("setupData") != null) {
        storedData = JSON.parse(localStorage.getItem("setupData"));
        if (storedData["bases"] != undefined) {
            bases = storedData["bases"];
        }
        if (storedData["weapons"] != undefined) {
            weapons = storedData["weapons"];
        }
        if (storedData["charms"] != undefined) {
            charms = storedData["charms"];
        }
        console.log("Bases loaded: " + bases.length);
        console.log("Weapons loaded: " + weapons.length);
        console.log("Charms loaded: " + charms.length);
    }
    if (Object.size(storedData) > 0) {

        $("#all_weapons_checkbox").prop('checked', false);
        $("#all_bases_checkbox").prop('checked', false);
        $("#all_charms_checkbox").prop('checked', false);
        $(".base_checkbox").prop('checked', false);
        $(".weapon_checkbox").prop('checked', false);
        $(".charm_checkbox").prop('checked', false);

        if (bases != undefined) {
            var indexedBases = baseKeys;
            for (var i = 0; i < indexedBases.length; i++) {
                var currentB = indexedBases[i];
                if (bases.indexOf(currentB) >= 0) {
                    $(".base_checkbox").get(i).checked = true;
                }
            }
        }
        if (weapons != undefined) {
            var indexedWeapons = weaponKeys;
            for (var i = 0; i < indexedWeapons.length; i++) {
                var currentW = indexedWeapons[i];
                if (weapons.indexOf(currentW) >= 0) {
                    $(".weapon_checkbox").get(i).checked = true;
                    if (currentW == "Isle Idol Trap") {
                        $(".weapon_checkbox").get(indexedWeapons.indexOf("Isle Idol Hydroplane Skin")).checked = true;
                        $(".weapon_checkbox").get(indexedWeapons.indexOf("Isle Idol Stakeshooter Skin")).checked = true;
                    }
                }
            }
        }
        if (charms != undefined) {
            var indexedCharms = charmKeys;
            for (var i = 0; i < indexedCharms.length; i++) {
                if (charms.indexOf(indexedCharms[i]) >= 0) {
                    $(".charm_checkbox").get(i).checked = true;
                }
            }
        }
        localStorage.removeItem("setupData");
        saveSetupCookie();
    }

    if (typeof Cookies.get('setup') != 'undefined') {
        var savedSetup = JSON.parse(Cookies.get('setup'));
        var savedWeapons = savedSetup['weapons'];
        var savedBases = savedSetup['bases'];
        var savedCharms = savedSetup['charms'];

        if (savedWeapons.length != weaponKeys.length || savedBases.length != baseKeys.length || savedCharms.length != charmKeys.length) {
            window.alert("New items have been added. Please re-tick what you own, or use the bookmarklet. Sorry for any inconvenience!")
            //Delete cookie
            Cookies.remove('setup', {
                path: '/'
            });
            Cookies.remove('setup', {
                path: '/MH-Tools'
            });
        } else {
            //Unticks 'All' if there was an unticked box stored in the cookie
            if (savedWeapons.indexOf(0) >= 0) {
                $("#all_weapons_checkbox").prop('checked', false);
            }

            if (savedBases.indexOf(0) >= 0) {
                $("#all_bases_checkbox").prop('checked', false);
            }

            if (savedCharms.indexOf(0) >= 0) {
                $("#all_charms_checkbox").prop('checked', false);
            }

            //Iterates through arrays saved in cookie and unticks checkboxes accordingly
            for (var i = 0; i < savedWeapons.length; i++) {
                $(".weapon_checkbox").get(i).checked = savedWeapons[i];
            }

            for (var i = 0; i < savedBases.length; i++) {
                $(".base_checkbox").get(i).checked = savedBases[i];
            }

            for (var i = 0; i < savedCharms.length; i++) {
                $(".charm_checkbox").get(i).checked = savedCharms[i];
            }
        }
    }
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
                if (insertedCheeses.indexOf(optionArray[j]) < 0) {
                    cheeseDropdownHTML += "<option>" + optionArray[j] + "</option>\n";
                    insertedCheeses.push(optionArray[j]);
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
    var charmDropdown = document.getElementById("charm");
    var charmDropdownHTML = '<option>-</option>';

    var popArrayLPC = popArray[locationName][phaseName][cheeseName];
    if (popArrayLPC == undefined) {
        var popArrayLP = popArray[locationName][phaseName];
        for (var cheese in popArrayLP) {
            if (cheese.indexOf(cheeseName) >= 0) {
                popArrayLPC = popArray[locationName][phaseName][cheese];
            }
        }
    }

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

function updateLink() {
    var URLString = 'setup.html?';
    var select = document.getElementById("charm");
    var selectedCharm = select.children[select.selectedIndex].innerHTML;

    if (locationName != "") URLString += "&location=" + locationName;
    if (phaseName != "" && phaseName != "-") URLString += "&phase=" + phaseName;
    if (cheeseName != "") URLString += "&cheese=" + cheeseName;
    if (selectedCharm != "-") URLString += "&charm=" + selectedCharm;
    if (isToxic != "" && isToxic != "-" && $("#toxic").is(":visible")) URLString += "&toxic=" + isToxic;
    if (batteryPower != 0) URLString += "&battery=" + batteryPower;
    if (gsLuck == 0) URLString += "&gs=" + gsLuck;
    if (bonusLuck >= 0) URLString += "&bonusLuck=" + bonusLuck;
    if (tournamentName != "") URLString += "&tourney=" + tournamentName;

    document.getElementById("link").href = URLString;

    ga('send', 'event', 'link', 'updated', URLString);
    /*
     ga('send', 'event', 'weapon', 'selected', weaponName);
     ga('send', 'event', 'location', 'selected', locationName);
     ga('send', 'event', 'cheese', 'selected', cheeseName);
     ga('send', 'event', 'base', 'selected', baseName);
     ga('send', 'event', 'charm', 'selected', charmName);
     ga('send', 'event', 'tournament', 'selected', tournamentName);*/
}

function weaponChanged() {
    //updateLink();

    var weaponsArrayN = weaponsArray[weaponName];
    if (weaponsArrayN == undefined) weaponsArrayN = [0];

    weaponPower = weaponsArrayN[1];
    trapType = weaponsArrayN[0];
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
//	    $("#pleaseWaitMessage").show(); 
        //console.log(popArray[locationName][cheeseName]);
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
                "location" : locationName,
                "phase" : phaseName,
                "cheese" : cheeseName,
                "charm" : charmName,
                "gs" : !gsLuck,
                "bonusLuck" : bonusLuck,
                "weapon" : weapon,
                "base" : base,
                "toxic" : isToxic,
                "battery" : batteryPower,
            };
            var URLString = buildURL('cre.html',urlParams);
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
    //tableHTML.innerHTML += "<tr><td>" + "Maniacal" + "</td></tr>";

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

    var resort = true, callback = function () {
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
            "location" : locationName,
            "phase" : phaseName,
            "cheese" : cheeseName,
            "charm" : charmName,
            "gs" : !gsLuck,
            "bonusLuck" : bonusLuck,
            "weapon" : weaponName,
            "base" : baseName,
            "toxic" : isToxic,
            "battery" : batteryPower,
        };
        var URLString = buildURL('cre.html',urlParams);
        URLString = URLString.replace(/'/g, "%27");

        //console.log(URLString);

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