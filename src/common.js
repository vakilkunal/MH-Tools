/**
 * Created by renet on 2016/10/29.
 * Functions that are used for both the CRE and the Best setup tool
 */
var user;
var CRE_USER = "cre";
var SETUP_USER = "setup";
var DEFAULT_STATS = [0, 0, 0, 0, "No Effect"];

var popLoaded = 0, baselineLoaded = 0;
var weaponPower = 0, weaponBonus = 0, weaponLuck = 0, weaponAtt = 0, weaponEff = 0;
var basePower = 0, baseBonus = 0, baseLuck = 0, baseAtt = 0, baseEff = 0;
var charmPower = 0, charmBonus = 0, charmAtt = 0, charmLuck = 0, charmEff = 0;
var gsLuck = 7, bonusLuck = 0, pourBonus = 0, pourLuck = 0, isToxic = "", batteryPower = 0, lanternStatus = "";
var trapPower = 0, trapLuck = 0, trapType = "", trapAtt = 0, trapEff = 0;
var baseName = "", charmName = "", locationName = "", cheeseName = "", tournamentName = "", weaponName = "", phaseName = "";
var cheeseBonus = 0;
var cheeseLoaded = 0, charmLoaded = 0;
var riftStalkerCodex = false;

var fortRox = {
    ballistaLevel : 0,
    canonLevel : 0
};

var specialCharm = {
    "Champion Charm": 1,
    "Growth Charm": 1,
    "Spellbook Charm": 1,
    "Wild Growth Charm": 1,
    "Snowball Charm": 1,

    "Golden Tournament Base": 1,
    "Soiled Base": 1,
    "Spellbook Base": 1
};

Object.size = function (obj) {
    return obj.length || Object.keys(obj).length;
};

function commafy(x) {
    return x.toLocaleString();
}

function contains(arrayOrString, searchElement) {
    return arrayOrString.indexOf(searchElement) > -1;
}

function calcSpecialCharms(charmName) {
    populateCharmData(charmName);
    if (charmName === "Champion Charm") {
        //Check if GTB used. If so +4 luck
        if (baseName === "Golden Tournament Base") {
            charmLuck += 4;
        }
        else if (baseName === "Silver Tournament Base") {
            charmLuck += 3;
        }
        else if (baseName === "Bronze Tournament Base") {
            charmLuck += 2;
        }

    } else if (charmName === "Growth Charm") {
        if (baseName === "Soiled Base") {
            charmPower += 100;
            charmBonus += 3;
            charmAtt += 5;
            charmLuck += 4;
        }
    } else if (charmName === "Wild Growth Charm") {
        if (baseName === "Soiled Base") {
            charmPower += 300;
            charmBonus += 8;
            charmAtt += 20;
            charmLuck += 9;
        }
    } else if (charmName === "Spellbook Charm") {
        if (baseName === "Spellbook Base") {
            charmPower += 500;
            charmBonus += 8;

        }

    }  else if (charmName === "Snowball Charm") {
        if (contains(festiveTraps, weaponName)) {
            charmBonus += 20;
        }
    }

    if (user === CRE_USER) {
        calculateTrapSetup();
    }
}

/**
 * Get a specific parameter from the URL
 * @param name
 * @return {string}
 */
function getURLParameter(name) {
    return decodeURIComponent(
        (new RegExp(name + "=(.+?)(&|$)").exec(location.search) || [, null])[1]
    );
}

/**
 * Build URL from key/value pairs.
 *  - Keys are only added to the URL if their value is !false, >0, != "-"
 *  - NB: Always test this with Toxic Spill sublocations if it is changed
 * @param location
 * @param urlParams
 * @returns {string}
 */
function buildURL(location, urlParams) {
    var url = location + "?";
    for (var key in urlParams) {
        var urlParam = urlParams[key];
        if (urlParam && urlParam !== "-") {
            url += key + "=" + encodeURIComponent(urlParam) + "&";
        }
    }
    return url;
}

/**
 * Gets the number of rift items
 * @param weapon {String} Weapon Name
 * @param base {String} Base Name
 * @param charm [String} Charm Name
 * @return {number}
 */
function getRiftCount(weapon, base, charm) {
    var riftCount = 0;
    if (contains(riftWeapons, weapon)) riftCount++;
    if (contains(riftBases, base)) riftCount++;
    if (contains(riftCharms, charm)) riftCount++;
    return riftCount;
}

function calculateTrapSetup(skipDisp) {
    var specialPower = 0, specialLuck = 0, specialBonus = 0, braceBonus = 0;

    if (locationName && weaponName && baseName && phaseName) {
        locationSpecificEffects();

        if (trapType === "Physical" && baseName === "Physical Brace Base") {
            //noinspection ReuseOfLocalVariableJS
            braceBonus = 25;
        } else if ((baseName === "Polluted Base" || baseName === "Refined Pollutinum Base") && charmName.indexOf("Polluted Charm") >= 0) {
            if (charmName === "Polluted Charm") {
                specialLuck += 4;
            } else if (charmName === "Super Polluted Charm") {
                specialLuck += 6;
            } else if (charmName === "Extreme Polluted Charm") {
                specialLuck += 10;
            } else if (charmName === "Ultimate Polluted Charm") {
                specialLuck += 15;
            }
        }
        determineRiftBonus();

        /*
         * Battery Levels
         */
        checkBatteryLevel();
        trapType = getPowerType(charmName, weaponName);

        trapPower = getTotalTrapPower();

        //noinspection OverlyComplexArithmeticExpressionJS
        var totalLuck = weaponLuck + baseLuck + gsLuck + charmLuck + bonusLuck + pourLuck + specialLuck;
        trapLuck = Math.floor(totalLuck * Math.min(1, getAmpBonus()));
        trapAtt = weaponAtt + baseAtt + charmAtt;
        if (trapAtt > 100) {
            trapAtt = 100;
        }
        trapEff = weaponEff + baseEff + charmEff;
        if (trapEff > 6) {
            trapEff = 6;
        }
        else if (trapEff < -6) {
            trapEff = -6;
        }

        if (user === CRE_USER && !skipDisp) {
            showPop(2);
            showTrapSetup();
        }
    } else {
        showTrapSetup(0);
    }

    //Only calculate if both weapon and base selected
    //TODO: Cleanup
    function locationSpecificEffects() {
        function isTribalArea(location) {
            return location === "Elub Shore"
                || location === "Nerg Plains"
                || location === "Derr Dunes";
        }

        if (locationName === "Claw Shot City") {
            if ((weaponName === "S.L.A.C." || weaponName === "S.L.A.C. II")
                && baseName === "Claw Shot Base") {
                if (charmName.indexOf("Cactus Charm") >= 0) specialPower += 2500;
                else specialPower += 1000;
            }
        } else if (locationName === "Seasonal Garden") {
            if (baseName === "Seasonal Base") {
                specialBonus += 18;
            }
            if ((weaponName === "Soul Harvester"  || weaponName === "Terrifying Spider Trap")
                && phaseName === "Fall") {
                specialLuck += 10;
            }
        } else if ((contains(locationName,"Iceberg") || locationName === "Slushy Shoreline")
            && weaponName.indexOf("Steam Laser Mk.") >= 0) {
            if (weaponName === "Steam Laser Mk. I") {
                specialPower += 1750;
                specialLuck += 3;
            }
            else if (weaponName === "Steam Laser Mk. II") {
                specialPower += 1250;
                specialLuck += 2;
            }
            else if (weaponName === "Steam Laser Mk. III") {
                specialPower += 1500;
                specialLuck += 2;
            }
        } else if ((phaseName.indexOf("Icewing's Lair") >= 0 || phaseName.indexOf("Hidden Depths") >= 0 || phaseName.indexOf("The Deep Lair") >= 0)
            && baseName === "Deep Freeze Base") {
            specialPower += 665;
            specialLuck += 9;
        } else if (locationName === "Gnawnian Express Station") {
            if (weaponName === "Bandit Deflector" && phaseName.indexOf("Raider River") >= 0) {
                specialPower += 1500;
            } else if (weaponName === "Engine Doubler" && phaseName.indexOf("Daredevil Canyon") >= 0) {
                specialPower += 1500;
            } else if (weaponName === "Supply Grabber" && phaseName.indexOf("Supply Depot") >= 0) {
                specialPower += 1500;
            }
        } else if (isTribalArea(locationName) || locationName === "Cape Clawed") {
            if (baseName === "Tiki Base") {
                specialLuck += 6;
            }

            if ((locationName === "Derr Dunes" && charmName === "Derr Power Charm")
                || (locationName === "Nerg Plains" && charmName === "Nerg Power Charm")
                || (locationName === "Elub Shore" && charmName === "Elub Power Charm")) {
                specialPower += 600;
                specialBonus += 5;
            }
        } else if (locationName === "Fiery Warpath") {
            if (charmName === "Flamebane Charm") {
                specialBonus += 150;
            }
            if (phaseName === "Wave 4" && weaponName === "Warden Slayer Trap") {
                specialPower += 2500;
                specialBonus += 2500;
            }
        } else if (locationName === "Toxic Spill") {
            if (baseName === "Washboard Base") {
                specialBonus += 5;
                specialLuck += 5;
            }
            if (charmName === "Soap Charm") {
                specialPower += 5000;
                specialLuck += 10;
            } else if (charmName === "Super Soap Charm") {
                specialPower += 8000;
                specialLuck += 12;
            }
        } else if (locationName === "Jungle of Dread" ) {
            if (weaponName === "Dreaded Totem Trap") {
                specialPower += 8500;
            }
            if (charmName === "Dreaded Charm") {
                specialBonus += 300;
            }
        }  else if (locationName === "Sunken City" && baseName === "Depth Charge Base" && phaseName !== "Docked") {
            specialPower += 1000;
        } else if (locationName === "Town of Digby" && cheeseName === "Limelight" && charmName === "Mining Charm") {
            specialBonus += 30;
        } else if (locationName === "Fort Rox") {
            fortRox.ballistaLevel = $("#ballistaLevel").val();
            fortRox.canonLevel = $("#canonLevel").val();
        }

        if (cheeseName.indexOf("Fusion Fondue") >= 0 && charmName === "EMP400 Charm") {
            specialPower += 25000;
        }
    }

    function getTotalTrapPower() {
        var totalPower = weaponPower + basePower + charmPower + specialPower;
        var setupPowerBonus = weaponBonus + baseBonus + charmBonus;
        var totalBonus = 1 + (setupPowerBonus + specialBonus + cheeseBonus + braceBonus) / 100;
        var totalPourBonus = 1 + pourBonus / 100 * (1 + setupPowerBonus/100);

        return Math.round(totalPower * totalBonus * totalPourBonus * getAmpBonus());
    }

    function getAmpBonus() {
        return ztAmp / 100;
    }

    function determineRiftBonus() {
        var riftCount = getRiftCount(weaponName, baseName, charmName);
        var multiplier = 1;

        if (riftStalkerCodex) {
            multiplier = 2;
        }

        if (riftCount === 2) {
            specialBonus += 10 * multiplier;
        } else if (riftCount === 3) {
            specialBonus += 10 * multiplier;
            specialLuck += 5 * multiplier;
        }
    }

    function checkBatteryLevel() {
        if (locationName !== "Furoma Rift") {
            batteryPower = 0;
        }
        var batteryExtras = batteryEffects[batteryPower] || [0, 0];
        specialPower += batteryExtras[0];
        specialLuck += batteryExtras[1];
    }

    /**
     * Get power type
     */
    function getPowerType(charm, weapon) {
        var charmPowerTypes = {
            "Forgotten Charm": "Forgotten",
            "Nanny Charm": "Parental",
            "Hydro Charm": "Hydro",
            "Shadow Charm": "Shadow"
        };

        return charmPowerTypes[charm] || weaponsArray[weapon][0];
    }
}

/**
 * Catch Rate calculation
 * Source: https://mhanalysis.wordpress.com/2011/01/05/mousehunt-catch-rates-3-0/
 * @param eff Effectiveness
 * @param tp Trap Power
 * @param tl Trap Luck
 * @param mp Mouse Power
 * @returns {number} Catch Rate Estimate: Number between 0 and 1
 */
function calcCR(eff, tp, tl, mp) {
    return Math.min((eff * tp + (3 - Math.min(eff, 2)) * Math.pow((Math.min(eff, 2) * tl), 2)) / (eff * tp + mp), 1);
}

function batteryChanged() {
    var input = document.getElementById("battery");
    var batteryLevel = input.value;
    batteryPower = parseInt(batteryLevel) || 0;

    if (batteryPower < 0) {
        batteryPower = 0;
    }
    else if (batteryPower > 10) {
        batteryPower = 10;
    }

    updateLink();

    if (user === CRE_USER) {
        calculateTrapSetup();
    }
}

/**
 * Returns effectivity of current power type against a mouse.
 * @param mouseName
 * @returns {number}
 */
function findEff(mouseName) {
    if (trapType === "") {
        return 0;
    } else {
        var typeIndex = typeEff[trapType];
        return (powersArray[mouseName][typeIndex]) / 100;
    }
}

function getCheeseAttraction() {
    var baselineAtt = baselineAttArray[cheeseName] || baselineArray[locationName + " (" + cheeseName + ")"];
    return baselineAtt + trapAtt / 100 - trapAtt / 100 * baselineAtt;
}

function gsParamCheck() {
    var gsParameter = getURLParameter("gs");
    if (gsParameter !== "null") {
        var select = document.getElementById("gs");
        select.value = "No";
        gsChanged();
    }
}

function checkToxicWidget(custom) {
    if (!custom) {
        if (cheeseName === "Brie" || cheeseName === "SB+") {
            $("#toxicRow").show(500);
            toxicChanged();
        }
        else {
            $("#toxicRow").hide();
            toxicChanged();
        }
    }
}

function toxicChanged() {
    var select = document.getElementById("toxic");
    isToxic = select.value;

    if (isToxic === "Yes" && (cheeseName === "Brie" || cheeseName === "SB+")) {
        cheeseBonus = 20;
    }
    else {
        cheeseBonus = 0;
    }

    updateLink();
    calculateTrapSetup();
}



function charmChangeCommon(newCharmName) {
    if (newCharmName) {
        charmName = newCharmName;
    }
    updateLink();
    if (specialCharm[charmName]) calcSpecialCharms(charmName);
    else {
        populateCharmData(charmName);
    }
}

/**
 * Populates global variables with charm data
 * @param selectedCharm Name of charm
 */
function populateCharmData(selectedCharm) {
    var charmsArrayN = charmsArray[selectedCharm] || DEFAULT_STATS;
    charmPower = parseInt(charmsArrayN[0]);
    charmBonus = parseInt(charmsArrayN[1]);
    charmAtt = parseInt(charmsArrayN[2]);
    charmLuck = parseInt(charmsArrayN[3]);
    charmEff = parseFreshness[charmsArrayN[4]];
}

/**
 * Populates the global variables for the weapon
 * @param armedWeapon the name of the weapon
 */
function populateWeaponData(armedWeapon) {
    var weaponsArrayN = weaponsArray[armedWeapon] || DEFAULT_STATS;
    trapType = weaponsArrayN[0];
    weaponPower = weaponsArrayN[1];
    weaponBonus = weaponsArrayN[2];
    weaponAtt = weaponsArrayN[3];
    weaponLuck = weaponsArrayN[4];
    weaponEff = parseFreshness[weaponsArrayN[5]];
}

/**
 * Populates the global variables for the base
 * @param {string} armedBase the name of the base
 */
function populateBaseData(armedBase) {
    var basesArrayN = basesArray[armedBase] || DEFAULT_STATS;
    baseName = armedBase;
    basePower = parseInt(basesArrayN[0]);
    baseBonus = parseInt(basesArrayN[1]);
    baseAtt = parseInt(basesArrayN[2]);
    baseLuck = parseInt(basesArrayN[3]);
    baseEff = parseFreshness[basesArrayN[4]];
}

/**
 * Loads a dropdown menu for weapons, bases or charms
 * @param {string} category The items to load. The same as the URL parameter and the item ID
 * @param {string[]} array The item names
 * @param {function} callback A callback fucntion that takes no parameters
 * @param {string} [initialHtml] Optional. Initial html content in the select
 */
function loadDropdown(category, array, callback, initialHtml) {
    var inputElement = document.getElementById(category);
    var dropdownHtml =  initialHtml || "";
    for (var key in array) {
        dropdownHtml += "<option>" + array[key] + "</option>\n";
    }

    inputElement.innerHTML = dropdownHtml;

    inputElement.value = getURLParameter(category);
    if (inputElement.selectedIndex === -1) {
        inputElement.selectedIndex = 0;
    }
    callback();

}

/**
 * Load the location drop down list from the population data and select correct location from URL apramters
 */
function loadLocationDropdown() {
    var array = Object.keys(popArray || []);
    array.sort();

    loadDropdown("location", array, locationChanged, "<option></option>")
}


function showTrapSetup(type) {
    var trapSetup = document.getElementById("trapSetup");

    if (type === 0) trapSetup.innerHTML = "<tr><td></td></tr>";
    else {
        trapSetup.innerHTML = "<tr><td>Type</td><td>" + trapType + "<tr><td>Power</td><td>" + commafy(trapPower) + "</td></tr>" +
            "<tr><td>Luck</td><td>" + trapLuck + "</td></tr><tr><td>Attraction Bonus</td><td>" + trapAtt + "%</td></tr>" +
            "<tr><td>Cheese Effect</td><td>" + reverseParseFreshness[trapEff] + "</td></tr>";
    }
}

function gsChanged() {
    var select = document.getElementById("gs");

    if (select.value === "Y") gsLuck = 7;
    else gsLuck = 0;

    updateLink();
    calculateTrapSetup();
    //showPop();
}

function getIcebergBase() {
    var autoBase = "";
    if (contains(phaseName,"Magnet")) {
        autoBase = "Magnet Base";
    }
    else if (contains(phaseName,"Hearthstone")) {
        autoBase = "Hearthstone Base";
    }
    else if ((phaseName === "Bombing Run"
        || phaseName === "The Mad Depths"
        || phaseName === "Treacherous Tunnels")
        && baseName === "Magnet Base") {
        autoBase = "";
    }
    else if (phaseName === "The Mad Depths"
        && baseName === "Hearthstone Base") {
        autoBase = "";
    }

    if (autoBase !== "") {
        var selectBase = document.getElementById("base");
        selectBase.value = autoBase;
        baseChanged();
    }
}

function phaseChanged() {
    function setPhase() {
        var select = document.getElementById("phase");
        phaseName = select.value;

        if (phaseName === "") {
            phaseName = "-";
        }
    }

    setPhase();

    if (!popArray[locationName][phaseName]) {
        var phases = Object.keys(popArray[locationName]);
        loadDropdown("phase", phases, function () {
            document.getElementById("#phase").selectedIndex = 0;
            setPhase();
        })
    }

    getIcebergBase();

    if (locationName === "Twisted Garden"
        && phaseName === "Poured") {
        pourBonus = 5;
        pourLuck = 5;
        calculateTrapSetup();
    } else {
        pourBonus = 0;
        pourLuck = 0;
        calculateTrapSetup();
    }
    loadCheeseDropdown(locationName, phaseName);
    updateLink();
}

function bonusLuckChanged() {
    var luckInput = parseInt(document.getElementById("bonusLuck").value);

    if (luckInput >= 0) {
        bonusLuck = luckInput;
    }
    else if (luckInput < 0) {
        document.getElementById("bonusLuck").value = 0;
        bonusLuck = 0;
    }

    updateLink();
    calculateTrapSetup();
}

function checkToxicParam() {
    var toxicParameter = getURLParameter("toxic");
    if (toxicParameter !== "null") {
        var select = document.getElementById("toxic");
        select.value = toxicParameter;
        toxicChanged();
    }
}

/**
 * Show or hide and reset UI widgets based on the selected location:
 *    - All items with the css class display-location are hidden
 *    - Items wih the location-specific custom class is shown (eg. location-fiery-warpath, location-labyrinth) are shown
 *    - If a custom setup is used only location specific items inside the .comments block will be shown
 * @param custom Is a custom setup being used
 */
function showHideWidgets(custom) {
    $("#toxicRow").hide();
    $("#toxic").val('No');
    $("#battery").val('-');
    $("#ampSlider").slider('option', 'value', 100);

    $(".display-location").hide();
    var locationNameClass = ".display-" + locationName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
    $(".comments " + locationNameClass).show(500);
    if (!custom) {
        $(locationNameClass).show(500);
    }
    checkToxicWidget(custom);
}

function clearResults() {
    var results = document.getElementById("results");
    results.innerHTML = '';
    formatSampleSize();
}

/**
 * Location change handler
 * - Update location variable
 * - Show/hide widgets
 * - Populate phases
 * - Clear results
 */
function locationChanged() {
    var select = document.getElementById("location");
    locationName = select.value;

    var checked = user === CRE_USER && document.getElementById("toggleCustom").checked;

    updateLink();
    showHideWidgets(checked);

    batteryPower = 0;
    ztAmp = 100;
    sampleSize = 0;

    //Populate sublocation dropdown and select first option
    if (locationName && locationName !== "") {
        populateSublocationDropdown(locationName);
    } else {
        $("#phaseRow").hide();
    }

    clearResults();

    function populateSublocationDropdown(locationName) {
        var category = "phase";
        var array = Object.keys(popArray[locationName] || ["-"]);
        loadDropdown(category, array, phaseChanged, "");
        if (array.length > 1) {
            $("#phaseRow").show()
        } else {
            $("#phaseRow").hide()
        }
    }
}

function genericOnChange() {
    calculateTrapSetup(false) ;
    showPop(2);
}