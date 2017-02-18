"use strict";

/*
 * Variable Initialization
 */
var cheeseCost = 0, sampleSize = 0;

// Special charms

// Turning CSV into usable array with the format location->phase->cheese->charm->mouse->attraction rate
var popCSV = [];
var popArray = [];
var pop = new XMLHttpRequest();
var baseline = new XMLHttpRequest();


window.onload = function () {
    user = CRE_USER;

    // if (location.href.indexOf("https") < 0) {
    // 	var currLoc = location.href;
    // 	currLoc = currLoc.replace("http", "https");
    // 	location.href = currLoc;
    // }

    //Instructions
    $("#instructions").click(function () {
        var instructionString = "Drag the blue 'CRE' link to your bookmarks bar if possible. If that doesn't work, try the manual steps below.\n\n";
        instructionString += "Google Chrome:\n- Bookmark a random page and name it 'CRE'";
        instructionString += "\n- Copy the bookmarklet code by right-clicking the 'CRE' link and selecting 'Copy link address...'";
        instructionString += "\n- Right click the newly created bookmark and select 'Edit...'";
        instructionString += "\n- Paste into the 'URL' field\n\n";
        instructionString += "Firefox:\n- Right click the 'CRE' link and select 'Bookmark This Link'\n\n";
        instructionString += "Internet Explorer:\n- Right click the 'CRE' link and select 'Add to favorites...'\n\n";
        instructionString += "Mobile/Other Browsers:\n- Same concept as above. Processes may vary";
        alert(instructionString);
    });

    //Bookmarklet storage logic
    if (creBookmarkletString != localStorage.getItem('creBookmarklet')) {
        alert("Bookmarklet has changed! Please update accordingly.");
        localStorage.setItem('creBookmarklet', creBookmarkletString);
    }
    $("#bookmarklet").attr("href", creBookmarkletString);

    //Initialize tablesorter, bind to table
    $("#results").tablesorter({
        // sortForce: [[noMice,1]],
        sortReset: true,
        widthFixed: true,
        ignoreCase: false,
        widgets: ["filter"],
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
        }
    });


    pop.open("get", POPULATIONS_URL, true);
    // Local testing
    // http-server -p 8888 --cors
    // (installed using "npm install http-server -g")
    // pop.open("get", "http://localhost:8888/testing/populationstest.csv", false);
    pop.onreadystatechange = function () {
        if (pop.readyState == 4) {

            processPop();
        }
    };
    pop.send();


    baseline.open("get", BASELINES_URL, true);
    baseline.onreadystatechange = function () {
        if (baseline.readyState == 4) {
            processBaseline(baseline.responseText);
        }
    };
    baseline.send();

    loadWeaponDropdown();
    loadBaseDropdown();
    loadCharmDropdown();

    gsParamCheck();

    //Listening for changes in dropdowns or textboxes
    document.getElementById("toggleCustom").onchange = function () {
        var toggle = document.getElementById("toggleCustom");
        if (toggle.checked) {
            $("#link").hide();
            $("#weaponRow").hide();
            $("#baseRow").hide();
            $("#charmRow").hide();
            $("#gsRow").hide();
            $("#bonusLuckRow").hide();
            $("#trapSetup").hide();

            $("#customType").show(500).find('select').val(trapType);
            $("#customPower").show(500).find('input').val(trapPower);
            $("#customLuck").show(500).find('input').val(trapLuck);
            $("#customAttraction").show(500).find('input').val(trapAtt);
            $("#customEffect").show(500).find('select').val(trapEff);

            $("#toxicRow").hide();
            $("#toxic").val('No');
            $("#batteryRow").hide();
            $("#battery").val('-');
            $("#ampRow").hide();
            $("#sliderRow").hide();

            $("#bonusLuck").val('0');
            bonusLuck = 0;
            batteryPower = 0;
            ztAmp = 100;

            updateCustomSetup();
        }
        else {
            $("#customType").hide();
            $("#customPower").hide();
            $("#customLuck").hide();
            $("#customAttraction").hide();
            $("#customEffect").hide();
            $("#link").show(500);
            $("#weaponRow").show(500);
            $("#baseRow").show(500);
            $("#charmRow").show(500);
            $("#gsRow").show(500);
            $("#bonusLuckRow").show(500);
            $("#trapSetup").show(500);

            if (cheeseName == "Brie" || cheeseName == "SB+") {
                $("#toxicRow").show(500);
            }
            if (locationName == "Furoma Rift") {
                $("#batteryRow").show(500);
            }
            else if (locationName == "Zugzwang's Tower") {
                $("#ampSlider").slider('option', 'value', 100);
                $("#ampRow").show(500);
                $("#sliderRow").show(500);
            }

            calculateTrapSetup();
        }
    };

    document.getElementById("trapPowerType").onchange = updateCustomSetup;
    document.getElementById("trapPowerValue").onchange = updateCustomSetup;
    document.getElementById("trapLuckValue").onchange =   updateCustomSetup;
    document.getElementById("trapAttractionValue").onchange = updateCustomSetup;
    document.getElementById("trapEffect").onchange = updateCustomSetup;

    document.getElementById("location").onchange = locationChanged;
    document.getElementById("phase").onchange = phaseChanged;
    document.getElementById("cheese").onchange = cheeseChanged;
    document.getElementById("lanternOil").onchange = oilChanged;
    document.getElementById("toxic").onchange = toxicChanged;
    document.getElementById("battery").onchange = batteryChanged;
    document.getElementById("weapon").onchange = weaponChanged;
    document.getElementById("base").onchange = baseChanged;
    document.getElementById("charm").onchange =  charmChanged;
    document.getElementById("gs").onchange = gsChanged;
    document.getElementById("bonusLuck").onchange = bonusLuckChanged;
    document.getElementById("tourney").onchange = tourneyChanged;

    document.getElementById("cheeseCost").onchange = function () {
        cheeseCost = parseInt(document.getElementById("cheeseCost").value);
        //showPop();
        showPop(2);
    };

    //Send to google analytics that link to setup was clicked
    document.getElementById("link").onclick = function () {
        ga('send', 'event', 'setup link', 'click');
    };
};

function updateCustomSetup() {
    var type = document.getElementById("trapPowerType").value;
    var power = document.getElementById("trapPowerValue").value;
    var luck = document.getElementById("trapLuckValue").value;
    var attraction = document.getElementById("trapAttractionValue").value;
    var effect = document.getElementById("trapEffect").value;
    if (power < 0) {
        power = 0;
        document.getElementById("trapPowerValue").value = 0;
    }
    if (luck < 0) {
        luck = 0;
        document.getElementById("trapLuckValue").value = 0;
    }
    if (attraction > 100) {
        attraction = 100;
        document.getElementById("trapAttractionValue").value = 100;
    }
    else if (attraction < 0) {
        attraction = 0;
        document.getElementById("trapAttractionValue").value = 0;
    }
    if (power >= 0) {
        trapType = type;
        trapPower = power;
        trapLuck = luck;
        trapAtt = attraction;
        trapEff = effect;
        showPop(2);
    }
}

function loadWeaponDropdown() {
    var weaponDropdown = document.getElementById("weapon");
    var weaponDropdownHTML = '<option></option>';

    for (var key in weaponKeys) {
        weaponDropdownHTML += "<option>" + weaponKeys[key] + "</option>\n";
    }

    weaponDropdown.innerHTML = weaponDropdownHTML;

    var weaponParameter = getURLParameter("weapon");
    if (weaponParameter != "null") {
        var select = document.getElementById("weapon");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == weaponParameter) {
                child.selected = true;
                weaponChanged();
                break;
            }
        }
    }
}

function loadBaseDropdown() {
    var baseDropdown = document.getElementById("base");
    var baseDropdownHTML = '<option></option>';

    for (var key in baseKeys) {
        baseDropdownHTML += "<option>" + baseKeys[key] + "</option>\n";
    }

    baseDropdown.innerHTML = baseDropdownHTML;

    var baseParameter = getURLParameter("base");
    if (baseParameter != "null") {
        var select = document.getElementById("base");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == baseParameter) {
                child.selected = true;
                baseChanged();
                break;
            }
        }
    }
}

function loadCharmDropdown() {
    var charmDropdown = document.getElementById("charm");
    var charmDropdownHTML = '<option>No Charm</option>';

    for (var key in charmKeys) {
        charmDropdownHTML += "<option>" + charmKeys[key] + "</option>\n";
    }

    charmDropdown.innerHTML = charmDropdownHTML;

    var charmParameter = getURLParameter("charm");
    if (charmParameter != "null") {
        var select = document.getElementById("charm");
        select.value = charmParameter;
        charmChanged();
    }
}


function checkLoadState() {
    var loadPercentage = (popLoaded + baselineLoaded) / 2 * 100;
    var status = document.getElementById("status");
    status.innerHTML = "<td>Loaded " + loadPercentage + "%...</td>";

    if (loadPercentage == 100) {
        loadLocationDropdown();
        loadTourneyDropdown();
        //updateLink();

        var oilParameter = getURLParameter("oil");
        if (oilParameter != "null") {
            var select = document.getElementById("lanternOil");
            for (var i = 0; i < select.children.length; i++) {
                var child = select.children[i];
                if (child.innerHTML == oilParameter) {
                    child.selected = true;
                    oilChanged();
                    break;
                }
            }
        }

        checkToxicParam();

        var batteryParameter = getURLParameter("battery");
        if (batteryParameter != "null") {
            var select = document.getElementById("battery");
            select.value = parseInt(batteryParameter);
            batteryChanged();
        }

        var amplifierParameter = parseInt(getURLParameter("amplifier"));
        if (amplifierParameter >= 0 && amplifierParameter <= 175) {
            $("#ampSlider").slider('option', 'value', amplifierParameter);
            var myColor = getColor(amplifierParameter);
            $("#ampSlider .ui-slider-range").css("background-color", myColor);
            $("#ampSlider .ui-state-default, .ui-widget-content .ui-state-default").css("background-color", myColor);
            $("#ampValue").val(amplifierParameter);
            ztAmp = amplifierParameter;
            calculateTrapSetup();
        }


        var totalLuck = getURLParameter("totalluck");
        if (totalLuck)
            calculateTrapSetup();
        var bonusLuckParameter = parseInt(getURLParameter("bonusLuck")) || (parseInt(totalLuck) - trapLuck);
        if (bonusLuckParameter >= 0) {
            document.getElementById("bonusLuck").value = bonusLuckParameter;
            bonusLuckChanged();
        }

        status.innerHTML = "<td>All set!</td>";
        setTimeout(function () {
            status.innerHTML = '<td><br></td>'
        }, 3000);
    }
}
/**
 * This one is different in CRE/best setup.
 */
function processPop() {
    var popText = pop.responseText;

    popCSV = CSVToArray(popText);

    var popCSVLength = Object.size(popCSV);

    //Creating popArray
    for (var i = 1; i < popCSVLength; i++) {
        if (popArray[popCSV[i][0]] == undefined) popArray[popCSV[i][0]] = [];
        if (popArray[popCSV[i][0]][popCSV[i][1]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]] = [];

        //Check for fuse constituents
        if (popCSV[i][2].indexOf("/") >= 0) {
            var sliced = popCSV[i][2].split("/");
            for (var j = 0; j < sliced.length; j++) {
                if (popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]] = [];

                if (popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]] = [];

                //Assign AR to a specific location/phase/cheese/charm/mouse
                popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);

                //Assign sample size value to a specific location/phase/cheese/charm when available
                if (popCSV[i][6].length > 0) {
                    popArray[popCSV[i][0]][popCSV[i][1]][sliced[j]][popCSV[i][3]]["SampleSize"] = parseInt(popCSV[i][6]);
                }
            }
        }
        else {
            if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]] = [];
            if (popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] == undefined) popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]] = [];
            popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]][popCSV[i][5]] = parseFloat(popCSV[i][4]);

            //Assign sample size value to a specific location/phase/cheese/charm when available
            if (popCSV[i][6].length > 0) {
                popArray[popCSV[i][0]][popCSV[i][1]][popCSV[i][2]][popCSV[i][3]]["SampleSize"] = parseInt(popCSV[i][6]);
            }
        }
    }

    popLoaded = 1;
    checkLoadState();
}

function formatSampleSize() {
//Set sample size and description of it
    var str = '';
    var colored = '';
    var sizeDescriptor = '';
    if (sampleSize == 0 || sampleSize == undefined) {
        sizeDescriptor = "N/A";
    }
    else if (sampleSize > 27000) {
        str = "excellent";
        colored = str.fontcolor("orange");
    }
    else if (sampleSize > 10000) {
        str = "good";
        colored = str.fontcolor("green");
    }
    else if (sampleSize > 2400) {
        str = "average";
        colored = str.fontcolor("blue");
    }
    else if (sampleSize > 500) {
        str = "poor";
        colored = str.fontcolor("red");
    }
    else {
        str = "very bad";
        colored = str.fontcolor("purple");
    }

    if (sampleSize != 0 && sampleSize != undefined) {
        sizeDescriptor = sampleSize + " (" + colored + ")";
    }
    var ss = document.getElementById("sampleSize");
    ss.innerHTML = "<tr><td id=\"ssid\">Sample Size</td><td>" + sizeDescriptor + "</td></tr>";
}

function showPop(type) { //type = 2 means don't reset charms
    var results = document.getElementById("results");
    var commonCheeseIndex;

    if (type != 0 && type != 2) charmName = "No Charm";

    if (locationName == '' || type == 0) {
        results.innerHTML = ''
    } else {
        var popArrayLPC = popArray[locationName][phaseName][cheeseName];

        //For common cheeses e.g. gouda, brie etc.
        if (popArrayLPC == undefined && cheeseName != "Cheese") {
            var popArrayL = popArray[locationName][phaseName];
            var locationKeys = Object.keys(popArrayL || []);
            var popArrayLLength = locationKeys.length;
            for (var i = 0; i < popArrayLLength; i++) {
                if (locationKeys[i].indexOf(cheeseName) >= 0 && locationKeys[i].indexOf("/") >= 0) {
                    commonCheeseIndex = locationKeys[i];
                    break;
                }
            }
            popArrayLPC = popArray[locationName][phaseName][commonCheeseIndex];
        }

        //Highlight special charms
        var specialCharmsList;
        var specialCharms = Object.keys(popArrayLPC || []);
        if (specialCharms.length > 1) {

            specialCharmsList = [];
            for (var key in specialCharms) {

                specialCharmsList.push(specialCharms[key]);
            }

            if (type != 2) highlightSpecialCharms(specialCharmsList);
        }
        /*
         * Allow pop with special charm(s) but without a "no charm" pop
         */
        else if (popArrayLPC != null && specialCharms[0] != "-") {
            sampleSize = 0;
            specialCharmsList = [];
            for (var key in specialCharms) {

                specialCharmsList.push(specialCharms[key]);
            }

            if (type != 2) highlightSpecialCharms(specialCharmsList);
        }
        else {
            if (type != 2) {
                console.log("Resetting charms");
                resetCharms();
            }
        }

        var popCharmName = /^(.*?)(?:\s+Charm)?$/i.exec(charmName)[1];
        if (popArrayLPC && popArrayLPC[popCharmName]) {
            console.log("It's a special charm!");
            var popArrayLC = popArrayLPC[popCharmName];
        }
        else {
            if (popArrayLPC != undefined) {
                popArrayLC = popArrayLPC['-'];
            }
        }


        var resultsHTML = "<thead><tr align='left'><th align='left'>Mouse</th><th data-filter='false'>Attraction<br>Rate</th><th data-filter='false'>Catch<br>Rate</th><th data-filter='false'>Catches per<br>100 hunts</th><th data-filter='false'>Gold</th><th data-filter='false'>Points</th><th data-filter='false'>Tournament<br>Points</th><th data-filter='false'>Min.<br>Luck</th>";
        if (locationName.indexOf("Seasonal Garden") >= 0) {
            var deltaAmpOverall = 0;
            resultsHTML += "<th data-filter='false'>Amp %</th>";
        } else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
            var deltaDepthOverall = 0, depthTest = 0;
            resultsHTML += "<th data-filter='false'>Catch ft</th><th data-filter='false'>FTC ft</th>";
        } else if (locationName.indexOf("Sunken City") >= 0 && phaseName != "Docked") {
            var diveMPH = 0;
            resultsHTML += "<th data-filter='false'>Metres<br>per hunt</th>";
        } else if (locationName == "Labyrinth" && phaseName != "Intersection") {
            var avgLanternClues = 0;
            resultsHTML += "<th data-filter='false'>Hallway Clues</th><th data-filter='false'>Dead End Clues</th>";
        }
        resultsHTML += "</tr></thead><tbody>";
        var overallCR = 0;
        var overallAR = getCheeseAttraction();

        var overallGold = 0;
        var overallPoints = 0;
        var overallTP = 0;
        var overallPX2 = 0;
        var percentSD = 0;
        var minLuckOverall = 0;

        if (specialCharmsList != undefined && specialCharmsList.indexOf(charmName.slice(0, -1)) >= 0) {
            sampleSize = 0;
        }

        var miceNames = Object.keys(popArrayLC || []);
        var noMice = miceNames.length;
        for (var i = 0; i < noMice; i++) {
            var mouseName = miceNames[i];

            if (mouseName != "SampleSize") {
                var eff = findEff(mouseName);

                // mousename test
                // if (powersArray[mouseName] == undefined) console.log("mouseName: " + mouseName);
                var mousePower = powersArray[mouseName][0];
                var catchRate = calcCR(eff, trapPower, trapLuck, mousePower);


                if (locationName == "Zugzwang's Tower") {
                    if (mouseName.indexOf("Rook") >= 0 && charmName == "Rook Crumble Charm") {
                        charmBonus += 300;
                        calculateTrapSetup(true); // not "cre" or else infinite loop
                        catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                        charmBonus -= 300;
                        calculateTrapSetup(true);
                    }
                    else if (mouseName == "Mystic Pawn") {
                        if (weaponName == "Mystic Pawn Pincher") {
                            weaponPower += 10920;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower -= 10920;
                            calculateTrapSetup(true);
                        }
                        else if (weaponName == "Technic Pawn Pincher") {
                            weaponPower -= 59.99;
                            weaponBonus -= 5;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower += 59.99;
                            weaponBonus += 5;
                            calculateTrapSetup(true);
                        }
                    }
                    else if (mouseName == "Technic Pawn") {
                        if (weaponName == "Mystic Pawn Pincher") {
                            weaponPower -= 59.99;
                            weaponBonus -= 5;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower += 59.99;
                            weaponBonus += 5;
                            calculateTrapSetup(true);
                        }
                        else if (weaponName == "Technic Pawn Pincher") {
                            weaponPower += 10920;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower -= 10920;
                            calculateTrapSetup(true);
                        }
                    }

                    if (mouseName.indexOf("Mystic") >= 0) {
                        if (weaponName == "Obvious Ambush Trap") {
                            weaponPower -= 2400;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower += 2400;
                            calculateTrapSetup(true);
                        }
                        else if (weaponName == "Blackstone Pass Trap") {
                            weaponPower += 1800;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower -= 1800;
                            calculateTrapSetup(true);
                        }
                    }
                    else if (mouseName.indexOf("Technic") >= 0) {
                        if (weaponName == "Obvious Ambush Trap") {
                            weaponPower += 1800;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower -= 1800;
                            calculateTrapSetup(true);
                        }
                        else if (weaponName == "Blackstone Pass Trap") {
                            weaponPower -= 2400;
                            calculateTrapSetup(true);
                            catchRate = calcCR(eff, trapPower, trapLuck, mousePower);
                            weaponPower += 2400;
                            calculateTrapSetup(true);
                        }
                    }
                }
                if (locationName == "Zugzwang's Tower" || locationName == "Seasonal Garden") {
                    if (ztAmp > 0 && weaponName == "Zugzwang's Ultimate Move") {
                        catchRate += ((1 - catchRate) / 2);
                    }
                }
                var minLuckValue = minLuck(eff, mousePower);
                minLuckOverall = Math.max(minLuckValue, minLuckOverall);


                //Exceptions, modifications to catch rates
                //Dragonbane Charm
                if (charmName == "Ultimate Charm") catchRate = 1;
                else if (locationName == "Sunken City" && charmName == "Ultimate Anchor Charm" && phaseName != "Docked") catchRate = 1;
                else if (mouseName == "Dragon" && charmName == "Dragonbane Charm") catchRate *= 2;
                else if (mouseName == "Bounty Hunter" && charmName == "Sheriff's Badge Charm") catchRate = 1;
                else if (mouseName == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") catchRate = 0;

                var attractions = parseFloat(popArrayLC[mouseName]) * overallAR;

                var catches = attractions * catchRate;


                if (miceArray[mouseName] == undefined) {
                    var mouseGold = 0;
                    var mousePoints = 0;
                } else {
                    var mouseGold = miceArray[mouseName][0];
                    var mousePoints = miceArray[mouseName][1];
                }


                if (charmName == "Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.05, 1800));
                else if (charmName == "Super Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.10, 4500));
                else if (charmName == "Extreme Wealth Charm") mouseGold += Math.ceil(Math.min(mouseGold * 0.20, 15000));

                var gold = catches * mouseGold / 100;
                var points = catches * mousePoints / 100;

                if (tourneysArray[tournamentName] != undefined) {
                    var tourneyPoints = tourneysArray[tournamentName][mouseName];
                    if (tourneyPoints == undefined) tourneyPoints = 0;
                } else tourneyPoints = 0;
                var TP = catches * tourneyPoints / 100;
                var PX2 = TP * tourneyPoints;

                overallCR += catches;
                overallTP += TP;
                overallPX2 += PX2;
                overallGold += gold;
                overallPoints += points;

                //Formatting
                catchRate *= 100;
                catchRate = catchRate.toFixed(2);
                catches = catches.toFixed(2);

                resultsHTML += "<tr align='right'><td align='left'>" + mouseName + "</td><td>" + attractions.toFixed(2) + "%</td><td>" + catchRate + "%</td><td>" + catches + "</td><td>" + commafy(mouseGold) + "</td><td>" + commafy(mousePoints) + "</td><td>" + tourneyPoints + "</td><td>" + minLuckValue + "</td>";
                if (locationName.indexOf("Seasonal Garden") >= 0) {
                    var dAmp = deltaAmp[mouseName];
                    if (charmName == "Amplifier Charm") dAmp *= 2;
                    resultsHTML += "<td>" + dAmp + "%</td>";
                    // console.log("Amp bonus", dAmp);
                    deltaAmpOverall += catches / 100 * dAmp;
                } else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
                    var deltaDepthCatch = catchDepth[mouseName];
                    var deltaDepthFTC = ftcDepth[mouseName];

                    if (charmName == "Wax Charm" && berglings.indexOf(mouseName) >= 0) {
                        deltaDepthCatch += 1;
                    } else if (charmName == "Sticky Charm" && berglings.indexOf(mouseName) >= 0) {
                        deltaDepthFTC = 0;
                    } else if (baseName == "Spiked Base" && brutes.indexOf(mouseName) >= 0) {
                        deltaDepthCatch = deltaDepthFTC = 0;
                    } else if (baseName == "Remote Detonator Base" && bombSquad.indexOf(mouseName) >= 0) {
                        deltaDepthCatch = 20;
                    }

                    // console.log("Catch dph:", deltaDepthCatch);
                    // console.log("FTC dph:", deltaDepthFTC);
                    resultsHTML += "<td>" + deltaDepthCatch + "</td><td>" + deltaDepthFTC + "</td>";

                    deltaDepthOverall += (catchRate / 100 * deltaDepthCatch + (100 - catchRate) / 100 * deltaDepthFTC) * attractions / 100;

                    depthTest += deltaDepthCatch * catches / 100 + deltaDepthFTC * (attractions - catches) / 100;
                } else if (locationName.indexOf("Sunken City") >= 0 && phaseName != "Docked") {
                    resultsHTML += "<td></td>";
                } else if (locationName == "Labyrinth" && phaseName != "Intersection") {
                    var mouseClues = labyrinthMiceClues[mouseName];
                    if (lanternStatus == "On" && mouseClues != 0) mouseClues++;
                    if (charmName == "Lantern Oil Charm" && mouseClues != 0) mouseClues++;
                    avgLanternClues += mouseClues * catches / 100;
                    resultsHTML += "<td>" + mouseClues + "</td><td></td>";
                }

                resultsHTML += "</tr>";
            }
        }

        if (popArray[locationName][phaseName][commonCheeseIndex] != undefined || popArray[locationName][phaseName][cheeseName] != undefined) {
            if (charmName == "No Charm") {
                if (commonCheeseIndex != undefined) {
                    if (popArray[locationName][phaseName][commonCheeseIndex]["-"] != undefined) {
                        sampleSize = popArray[locationName][phaseName][commonCheeseIndex]["-"]["SampleSize"];
                    }
                }
                else {
                    if (popArray[locationName][phaseName][cheeseName]["-"] != undefined) {
                        sampleSize = popArray[locationName][phaseName][cheeseName]["-"]["SampleSize"];
                    }
                }
            }
            else {
                var slice = '';
                if (charmName.indexOf("*") >= 0) {
                    slice = charmName.slice(0, -7);
                }
                else {
                    slice = charmName.slice(0, -6);
                }
                if (commonCheeseIndex != undefined) {
                    if (popArray[locationName][phaseName][commonCheeseIndex][slice] != undefined) {
                        sampleSize = popArray[locationName][phaseName][commonCheeseIndex][slice]["SampleSize"];
                    }
                    else {
                        if (popArray[locationName][phaseName][commonCheeseIndex]["-"] != undefined) {
                            sampleSize = popArray[locationName][phaseName][commonCheeseIndex]["-"]["SampleSize"];
                        }
                    }
                }
                else {
                    if (popArray[locationName][phaseName][cheeseName][slice] != undefined) {
                        sampleSize = popArray[locationName][phaseName][cheeseName][slice]["SampleSize"];
                    }
                    else {
                        if (popArray[locationName][phaseName][cheeseName]["-"] != undefined) {
                            sampleSize = popArray[locationName][phaseName][cheeseName]["-"]["SampleSize"];
                        }
                    }
                }
            }
        }

        //Formatting
        overallAR *= 100;
        overallPX2 -= overallTP * overallTP;
        overallPX2 = Math.sqrt(overallPX2);

        percentSD = overallPX2 / overallTP * 100;

        // console.log("overallCR: " + overallCR);
        resultsHTML += "</tbody><tr align='right'><td align='left'><b>Overall</b></td><td>" + overallAR.toFixed(2) + "%</td><td></td><td>" + overallCR.toFixed(2) + "</td><td>" + commafy(Math.round(overallGold)) + "</td><td>" + commafy(Math.round(overallPoints)) + "</td><td>" + overallTP.toFixed(2) + "</td><td>" + minLuckOverall + "</td>";
        if (locationName.indexOf("Seasonal Garden") >= 0) {
            deltaAmpOverall += (100 - overallAR) / 100 * -3; //Accounting for FTAs (-3%)
            resultsHTML += "<td>" + deltaAmpOverall.toFixed(2) + "%</td>";
        } else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
            resultsHTML += "<td colspan='2'>" + deltaDepthOverall.toFixed(2) + " ft/hunt</td>";
            // console.log("Depth test", depthTest);
        } else if (locationName.indexOf("Sunken City") >= 0 && phaseName != "Docked") {
            diveMPH = 30 * overallCR / 100 + 10 * (overallAR - overallCR) / 100;
            if (charmName.indexOf("Anchor Charm") >= 0) {
                diveMPH = 10 * overallCR / 100 + 10 * (overallAR - overallCR) / 100;
            }
            else if (charmName.indexOf("Water Jet Charm") >= 0) {
                diveMPH = 500 * overallCR / 100 + 10 * (overallAR - overallCR) / 100;
            }
            resultsHTML += "<td>" + diveMPH.toFixed(2) + "</td>";
        } else if (locationName == "Labyrinth" && phaseName != "Intersection") {
            resultsHTML += "<td>" + avgLanternClues.toFixed(2) + "</td>";
            var deadEnds = (overallAR - overallCR) / 100;
            if (baseName == "Minotaur Base" || baseName == "Labyrinth Base") deadEnds /= 2; //50% negate rate
            if (charmName == "Compass Magnet Charm") deadEnds = 0;
            resultsHTML += "<td>" + deadEnds.toFixed(2) + "</td>";
        }

        var cheeseEatenPerHunt = overallAR / 100;
        var cheeseStaledPerHunt = (100 - overallAR) / 100 * freshness2stale[trapEff];
        resultsHTML += "</tr><tr align='right'><td>Profit (minus cheese cost)</td><td></td><td></td><td></td><td>" + commafy(Math.round(overallGold - cheeseCost * (cheeseEatenPerHunt + cheeseStaledPerHunt))) + "</td><td></td><td></td><td></td>";

        if (locationName.indexOf("Seasonal Garden") >= 0 || locationName.indexOf("Sunken City") >= 0 && phaseName != "Docked") {
            resultsHTML += "<td></td>";
        }
        else if (locationName.indexOf("Iceberg") >= 0 && phaseName.indexOf("Lair") < 0) {
            resultsHTML += "<td colspan='2'></td>";
        }
        else if (locationName == "Labyrinth" && phaseName != "Intersection") {
            resultsHTML += "<td></td><td></td>";
        }
        resultsHTML += "</tr>";
        //resultsHTML += "<tr><td><b>Overall</b></td><td>" + overallAR.toFixed(2) + "%</td><td></td><td>" + overallCR.toFixed(2) + "%</td><td>" + overallGold.toFixed(2) + "</td><td>" + overallPoints.toFixed(2) + "</td><td>" + overallTP.toFixed(2) + "+-" + overallPX2.toFixed(2) + " (" + percentSD.toFixed(2) + "%)</td></tr>";

        results.innerHTML = resultsHTML;

        var resort = true, callback = function () {
            // empty
        };
        $("#results").trigger("updateAll", [resort, callback]);
    }

    formatSampleSize();
}

function resetCharms() {
    console.log("Reloading charm list");
    var select = document.getElementById("charm");
    var charmsDropdownHTML = '';

    var nCharms = charmKeys.length;
    for (var i = 0; i < nCharms; i++) {
        charmsDropdownHTML += "<option>" + charmKeys[i] + "</option>\n";
    }
    select.innerHTML = "<option>No Charm</option>" + charmsDropdownHTML;
    charmChanged();
}

function highlightSpecialCharms (charmList) {
    var select = document.getElementById("charm");
    var charmsDropdownHTML = '';

    var charmNames = Object.keys(charmsArray || []);
    var nCharms = charmNames.length;
    for (var c=0; c<nCharms; c++) {
        charmsDropdownHTML += "<option>"+charmNames[c]+"</option>\n";
    }
    select.innerHTML = "<option>No Charm</option>"+charmsDropdownHTML;

    for (var i=0; i<charmList.length; i++) {

        for (var j=0; j<select.children.length; j++) {
            var child = select.children[j];
            if (child.value == charmList[i]+" Charm") {

                child.innerHTML = child.innerHTML+"*";
                if (child.selected == true) {
                    charmName = child.innerHTML;
                    showPop(2);
                }
                select.innerHTML = select.innerHTML.slice(0,25) + "<option>"+child.innerHTML+"</option>" + select.innerHTML.slice(25);
                break;
            }
        }
    }
    selectCharm();
}

function loadCheeseDropdown() {
    console.log("Reloading cheese list");
    var cheeseDropdown = document.getElementById("cheese");
    var cheeseDropdownHTML = '';

    var cheeses = Object.keys(popArray[locationName][phaseName] || []);

    for (var key in cheeses) {
        var option = cheeses[key];
        if (option.indexOf("/") < 0 || option.indexOf("Combat") >= 0) { //Fix this master cheese thingy
            cheeseDropdownHTML += "<option>" + option + "</option>\n";
        } else {
            var optionArray = option.split("/");
            var optionArrayLength = optionArray.length;
            for (var j = 0; j < optionArrayLength; j++) {
                cheeseDropdownHTML += "<option>" + optionArray[j] + "</option>\n";
            }
        }
    }

    cheeseDropdown.innerHTML = cheeseDropdownHTML;

    var cheeseParameter = getURLParameter("cheese");
    if (cheeseParameter != "null" && cheeseLoaded < 3) {
        var select = document.getElementById("cheese");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == cheeseParameter) {
                child.selected = true;
                cheeseLoaded++;
                //Select correct charm from URL
                selectCharm();
                break;
            }
        }
    }

    cheeseChanged();
}

function selectCharm() {
    console.log("Selecting charm");
    var charmParameter = getURLParameter("charm");//.replace('*','');
    var specialCharmParameter = charmParameter + "*";
    if (charmParameter != "null" && charmLoaded < 5) {
        var select = document.getElementById("charm");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == charmParameter || child.innerHTML == specialCharmParameter) {
                child.selected = true;
                charmChanged();
                charmLoaded++;
                break;
            }
        }
    }
}

function loadTourneyDropdown() {
    var tourneyDropdown = document.getElementById("tourney");

    var tourneyDropdownHTML = '<option></option>';

    var tourneys = Object.keys(tourneysArray || []);
    for (var key in tourneys) {
        tourneyDropdownHTML += "<option>" + tourneys[key] + "</option>\n";
    }

    tourneyDropdown.innerHTML = tourneyDropdownHTML;

    var tourneyParameter = getURLParameter("tourney");
    if (tourneyParameter != "null") {
        var select = document.getElementById("tourney");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == tourneyParameter) {
                child.selected = true;
                tourneyChanged();
                break;
            }
        }
    }

}

function minLuck(E, M) {
    return Math.ceil(Math.sqrt((M / (3 - Math.min(E, 2))) / (Math.min(E, 2) * Math.min(E, 2))));
}

/*
 function loadGangs (type) {
 if (type == 0) {
 //hide gangs
 document.getElementById("phaseRow").style.display = 'none';
 }
 else {
 //show gangs
 document.getElementById("phaseRow").style.display = 'block';
 }
 }
 */
var urlParams
function updateLink() {

    urlParams = {
        "location" : locationName,
        "phase" : phaseName,
        "gs" : !gsLuck,
        "cheese" : cheeseName,
        "oil" : lanternStatus,
        "toxic" : isToxic,
        "battery" : batteryPower,
        "weapon" : weaponName,
        "base" : baseName,
        "charm" : charmName,
        "bonusLuck" : bonusLuck,
        "tourney" : tournamentName,
    };
    var URLString = buildURL('cre.html',urlParams);
    document.getElementById("link").href = URLString;
    /*
     //Horntracker link creation. Unused.
     var ht_URLString = 'http://horntracker.com/index.php?';
     if (locationName.indexOf("Balack's Cove") >= 0) {
     if (locationName == "Balack's Cove - Low Tide") ht_URLString+= "&location=38&tide=1";
     else if (locationName == "Balack's Cove - Mid Tide") ht_URLString+= "&location=38&tide=2";
     else if (locationName == "Balack's Cove - High Tide") ht_URLString+= "&location=38&tide=3";
     } else if (locationName.indexOf("Claw Shot City") >= 0) {
     if (locationName == "Claw Shot City (Hunting Bounty Hunter)") ht_URLString+= "&location=320&wantedphase=7";
     else if (locationName == "Claw Shot City (Crew)") ht_URLString+= "&location=320&wantedphase=6";
     else if (locationName == "Claw Shot City (Ringleaders)") ht_URLString+= "&location=320&wantedphase=8";
     } else if (locationName.indexOf("Cursed City") >= 0) {
     if (locationName.indexOf("Cursed City (Curse Lifted)") >= 0) ht_URLString+= "&location=311&cc_curse=0";
     else if (locationName == "Cursed City (Cursed)") ht_URLString+= "&location=311&cc_curse=1";
     } else if (locationName.indexOf("Fiery Warpath") >= 0) {
     if (locationName == "Fiery Warpath (Wave 1)") ht_URLString+= "&location=75&wave=1";
     else if (locationName == "Fiery Warpath (Wave 2)") ht_URLString+= "&location=75&wave=2";
     else if (locationName == "Fiery Warpath (Wave 3)") ht_URLString+= "&location=75&wave=3";
     else if (locationName == "Fiery Warpath (Wave 4)") ht_URLString+= "&location=75&wave=4";
     } else if (locationName.indexOf("Gnawnian Express Station") >= 0) {
     if (locationName == "Gnawnian Express Station (Waiting)") ht_URLString+= "&location=321&trainphase=4";
     else if (locationName == "Gnawnian Express Station (Supply Depot)") ht_URLString+= "&location=321&trainphase=1";
     else if (locationName == "Gnawnian Express Station (Raider River)") ht_URLString+= "&location=321&trainphase=2";
     else if (locationName == "Gnawnian Express Station (Daredevil Canyon)") ht_URLString+= "&location=321&trainphase=3";
     } else if(locationName.indexOf("Iceberg") >= 0) {
     if (locationName.indexOf("Iceberg: Bombing Run") >= 0) ht_URLString+= "&location=297&phase=4";
     else if (locationName == "Iceberg: Brutal Bulwark") ht_URLString+= "&location=297&phase=2";
     else if (locationName == "Iceberg: General Stage") ht_URLString+= "&location=297&phase=7";
     else if (locationName == "Iceberg: Hidden Depths") ht_URLString+= "&location=297&phase=12";
     else if (locationName == "Iceberg: Icewing's Lair") ht_URLString+= "&location=297&phase=6";
     else if (locationName == "Iceberg: The Deep Lair") ht_URLString+= "&location=297&phase=13";
     else if (locationName.indexOf("Iceberg: The Mad Depths") >= 0) ht_URLString+= "&location=297&phase=5";
     else if (locationName.indexOf("Iceberg: Treacherous Tunnels") >= 0) ht_URLString+= "&location=297&phase=1";
     } else if(locationName.indexOf("Living Garden") >= 0) {
     if (locationName == "Living Garden (Poured)") ht_URLString+= "&location=301&bucket=2";
     else ht_URLString+= "&location=301&bucket=1";
     } else if(locationName.indexOf("Lost City") >= 0) {
     if (locationName == "Lost City (Cursed)") ht_URLString+= "&location=304&lc_curse=1";
     else ht_URLString+= "&location=304&lc_curse=0";
     } else if(locationName.indexOf("Sand Dunes") >= 0) {
     if (locationName == "Sand Dunes (No Stampede)") ht_URLString+= "&location=302&stampede=0";
     else if (locationName.indexOf("Sand Dunes (Stampede)") >= 0) ht_URLString+= "&location=302&stampede=1";
     } else if(locationName.indexOf("Seasonal Garden") >= 0) {
     if (locationName.indexOf("Fall") >= 0) ht_URLString+= "&location=1&season=1";
     else if (locationName.indexOf("Spring") >= 0) ht_URLString+= "&location=1&season=3";
     else if (locationName.indexOf("Summer") >= 0) ht_URLString+= "&location=1&season=4";
     else if (locationName.indexOf("Winter") >= 0) ht_URLString+= "&location=1&season=2";
     } else if(locationName.indexOf("Twisted Garden") >= 0) {
     if (locationName == "Twisted Garden (Poured)") ht_URLString+= "&location=309&vials=2";
     else ht_URLString+= "&location=309&vials=1";
     }

     else if(locationName != "") ht_URLString+= "&location="+locations[locationName];
     if(cheeseName != "") ht_URLString+= "&cheese="+baits[cheeseName];
     if(weaponName != "") ht_URLString+= "&trap="+weapons[weaponName];
     if(baseName != "") ht_URLString+= "&base="+bases[baseName];
     if(charmName != "") ht_URLString+= "&charm="+trinkets[charmName];
     if(gsLuck == 0) ht_URLString+= "&shield="+"0";
     else ht_URLString+= "&shield="+"1";
     if(bonusLuck >= 0) ht_URLString+= "&bonusLuck="+bonusLuck;
     if(tournamentName != "") ht_URLString+= "&tourney="+tournamentName;
     //document.getElementById("ht_link").href = ht_URLString;
     */
    ga('send', 'event', 'link', 'updated', URLString);
    ga('send', 'event', 'weapon', 'selected', weaponName);
    ga('send', 'event', 'location', 'selected', locationName);
    ga('send', 'event', 'phase', 'selected', phaseName);
    ga('send', 'event', 'cheese', 'selected', cheeseName);
    ga('send', 'event', 'base', 'selected', baseName);
    ga('send', 'event', 'charm', 'selected', charmName);
    ga('send', 'event', 'tournament', 'selected', tournamentName);
}

function locationChanged() {
    console.log("Location changed");
    var select = document.getElementById("location");
    locationName = select.children[select.selectedIndex].innerHTML;
    updateLink();

    hideAllRows();
    if (document.getElementById("toggleCustom").checked == false) {
        if (locationName == "Furoma Rift") {
            $("#batteryRow").show(500);
            $("#frComment").show(500);
        }
        else if (locationName == "Whisker Woods Rift") {
            $("#wwrComment").show(500);
        }
        else if (locationName == "Zugzwang's Tower") {
            $("#ampSlider").slider('option', 'value', 100);
            $("#ampRow").show(500);
            $("#sliderRow").show(500);
            $("#ztComment").show(500);
        }
        else if (locationName == "Labyrinth") {
            $("#labyComment").show(500);
            $("#oilRow").show(500);
        }
        else if (locationName == "Fort Rox") {
            $("#roxComment").show(500);
        }
    }

    batteryPower = 0;
    ztAmp = 100;
    sampleSize = 0;
    showPop(0);
    //showPop(2);

    //Populate sublocation dropdown and select first option
    if (locationName != "") {
        populateSublocationDropdown(locationName);
    }
}

function hideAllRows() {
    $("#phaseRow").hide();
    $("#oilRow").hide();
    $("#toxicRow").hide();
    $("#toxic").val('No');
    $("#batteryRow").hide();
    $("#battery").val('-');
    $("#ampRow").hide();
    $("#sliderRow").hide();
    $("#wwrComment").hide();
    $("#frComment").hide();
    $("#labyComment").hide();
    $("#ztComment").hide();
    $("#roxComment").hide();
}



function cheeseChanged() {
    console.log("Cheese changed");
    var select = document.getElementById("cheese");
    cheeseName = select.children[select.selectedIndex].innerHTML;
    updateLink();

    //Basic cheese costs
    var costElement = document.getElementById("cheeseCost");

    cheeseCost = standardCheeseCost[cheeseName] || 0;
    costElement.value = cheeseCost;

    //Toxic checks
    if (document.getElementById("toggleCustom").checked == false) {
        if (cheeseName == "Brie" || cheeseName == "SB+") {
            $("#toxicRow").show(500);
            toxicChanged();
        }
        else {
            $("#toxicRow").hide();
            toxicChanged();
        }
    }

    showPop();
    //showPop(2);
    selectCharm();
}

function oilChanged() {
    var select = document.getElementById("lanternOil");
    lanternStatus = select.children[select.selectedIndex].innerHTML;

    updateLink();
    calculateTrapSetup();
}

function weaponChanged() {
    var select = document.getElementById("weapon");

    weaponName = select.children[select.selectedIndex].innerHTML;
    updateLink();

    var weaponsArrayN = weaponsArray[weaponName];
    if (weaponsArrayN == undefined) weaponsArrayN = [0];

    weaponPower = weaponsArrayN[1];
    trapType = weaponsArrayN[0].trim();
    weaponBonus = weaponsArrayN[2];
    weaponAtt = weaponsArrayN[3];
    weaponLuck = weaponsArrayN[4];
    weaponEff = parseFreshness[weaponsArrayN[5].trim()];

    calculateTrapSetup();
}

function icebergPhase() {
    var autoPhase = "";
    if (phaseName == "Bombing Run" && baseName == "Magnet Base") autoPhase = "Bombing Run (Magnet)";
    else if (phaseName == "Bombing Run (Magnet)" && baseName != "Magnet Base") autoPhase = "Bombing Run";

    else if (phaseName == "Treacherous Tunnels" && baseName == "Magnet Base") autoPhase = "Treacherous Tunnels (Magnet)";
    else if (phaseName == "Treacherous Tunnels (Magnet)" && baseName != "Magnet Base") autoPhase = "Treacherous Tunnels";

    else if ((phaseName == "The Mad Depths" || phaseName == "The Mad Depths (Magnet)") && baseName == "Hearthstone Base") autoPhase = "The Mad Depths (Hearthstone)";
    else if ((phaseName == "The Mad Depths" || phaseName == "The Mad Depths (Hearthstone)") && baseName == "Magnet Base") autoPhase = "The Mad Depths (Magnet)";
    else if (phaseName == "The Mad Depths (Hearthstone)" && baseName != "Hearthstone Base") autoPhase = "The Mad Depths";
    else if (phaseName == "The Mad Depths (Magnet)" && baseName != "Magnet Base") autoPhase = "The Mad Depths";

    if (autoPhase != "") {
        var phaseSelect = document.getElementById("phase");
        for (var i = 0; i < phaseSelect.children.length; i++) {
            var child = phaseSelect.children[i];
            if (child.innerHTML == autoPhase) {
                child.selected = true;
                phaseChanged();
                break;
            }
        }
    }
}
function baseChanged() {
    console.log("Base changed");
    var baseSelet = document.getElementById("base");

    baseName = baseSelet.children[baseSelet.selectedIndex].innerHTML;
    updateLink();

    icebergPhase();


    var basesArrayN = basesArray[baseName] || [0,0,0,0, "No Effect"];

    basePower = (basesArrayN[0]);
    baseBonus = (basesArrayN[1]);
    baseAtt = (basesArrayN[2]);
    baseLuck = (basesArrayN[3]);
    baseEff = parseFreshness[basesArrayN[4].trim()];


    //Bases with special effects when paired with particular charm
    charmChangeCommon();
    calculateTrapSetup();
}

function charmChanged() {
    console.log("Charm changed");
    var select = document.getElementById("charm");
    charmName = select.children[select.selectedIndex].innerHTML.trim().replace(/\*$/, "");
    charmChangeCommon();
    calculateTrapSetup();
    showPop(2);
}



function tourneyChanged() {
    var select = document.getElementById("tourney");
    tournamentName = select.children[select.selectedIndex].innerHTML;
    updateLink();

    //showPop();
    showPop(2);
}

