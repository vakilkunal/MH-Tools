/**
 * Created by renet on 2016/10/29.
 * Functions that are used for both the CRE and the Best setup tool
 */
var user;
var CRE_USER = "cre";

var popLoaded = 0, baselineLoaded = 0;
var weaponPower = 0, weaponBonus = 0, weaponLuck = 0, weaponAtt = 0, weaponEff = 0;
var basePower = 0, baseBonus = 0, baseLuck = 0, baseAtt = 0, baseEff = 0;
var charmPower = 0, charmBonus = 0, charmAtt = 0, charmLuck = 0, charmEff = 0;
var gsLuck = 7, bonusLuck = 0, pourBonus = 0, pourLuck = 0, isToxic = '', batteryPower = 0, lanternStatus = '';
var trapPower = 0, trapLuck = 0, trapType = '', trapAtt = 0, trapEff = 0;
var baseName = '', charmName = '', locationName = '', cheeseName = '', tournamentName = '', weaponName = '', phaseName = '';
var cheeseBonus = 0;
var cheeseLoaded = 0, charmLoaded = 0;
var balistaLevel = 0, canonLevel = 0;

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
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function commafy(x) {
    return x.toLocaleString();
}

function calcSpecialCharms(charmName) {
    var charmsArrayN = charmsArray[charmName] || [0, 0, 0, 0, "No Effect"];

    /* Basics */
    charmPower = charmsArrayN[0];
    charmBonus = charmsArrayN[1];
    charmAtt = charmsArrayN[2];
    charmLuck = charmsArrayN[3];
    charmEff = parseFreshness[charmsArrayN[4].trim()];
    if (charmName == "Champion Charm") {
        //Check if GTB used. If so +4 luck
        if (baseName == "Golden Tournament Base") {
            charmLuck = charmsArrayN[3] + 4;
        }
        else if (baseName == "Silver Tournament Base") {
            charmLuck = charmsArrayN[3] + 3;
        }
        else if (baseName == "Bronze Tournament Base") {
            charmLuck = charmsArrayN[3] + 2;
        }

    } else if (charmName == "Growth Charm") {
        //Check if soiled base used.
        if (baseName == "Soiled Base") {
            charmPower += 100;
            charmBonus += 3;
            charmAtt += 5;
            charmLuck += 4;
        }
    } else if (charmName == "Wild Growth Charm") {
        //Soiled base
        if (baseName == "Soiled Base") {
            charmPower += 300;
            charmBonus += 8;
            charmAtt += 20;
            charmLuck += 9;
        }
    } else if (charmName == "Spellbook Charm") {
        //Spellbook base
        if (baseName == "Spellbook Base") {
            charmPower += 500;
            charmBonus += 8;

        }

    }  else if (charmName == "Snowball Charm") {
        if (festiveTraps.indexOf(weaponName) > -1) {
            charmBonus += 20;
        }
    }

    if (user == CRE_USER)
        calculateTrapSetup();
}

function getURLParameter(name) {
    //Use component here to ensure correct decoding
    return decodeURIComponent(
        (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

/**
 * Build URL from key/value pairs.
 * Keys are only added to the URL if their value is !false, >0, != "-"
 * NB: Always test with Toxic Spill sublocations
 * @param location
 * @param urlParams
 * @returns {string}
 */
function buildURL(location, urlParams) {
    var url = location + "?";
    for (var key in urlParams) {
        var urlParam = urlParams[key];
        if (urlParam && urlParam != "-") {
            var value = encodeURIComponent(urlParam);
            url += key + "=" + value + "&"
        }
    }
    return url;
}

function getRiftCount() {
    var riftCount = 0;
    if (weaponName in riftWeapons) riftCount++;
    if (baseName in riftBases) riftCount++;
    if (charmName in riftCharms) riftCount++;
    return riftCount;
}

function calculateTrapSetup(skipDisp) {
    var specialPower = 0, specialLuck = 0, specialBonus = 0, braceBonus = 0;
    //console.log(weaponPower + " " + basePower + " " + charmPower);

    if (weaponPower && basePower) { //Only calculate if both weapon and base selected

        //Exceptions

        if (locationName.indexOf("Claw Shot City") >= 0 && (weaponName == "S.L.A.C." || weaponName == "S.L.A.C. II") && baseName == "Claw Shot Base") {
            if (charmName.indexOf("Cactus Charm") >= 0) specialPower += 2500;
            else specialPower += 1000;
        }
        else if ((weaponName == "Soul Harvester" || weaponName == "Terrifying Spider Trap") && ((locationName == "Seasonal Garden" && phaseName == "Fall") || locationName.indexOf("Haunted Terrortories") >= 0)) {
            specialLuck += 10;
        }
        else if ((locationName.indexOf("Iceberg") >= 0 || locationName.indexOf("Slushy Shoreline") >= 0) && weaponName.indexOf("Steam Laser Mk.") >= 0) {
            if (weaponName == "Steam Laser Mk. I") {
                specialPower += 1750;
                specialLuck += 3;
            }
            else if (weaponName == "Steam Laser Mk. II") {
                specialPower += 1250;
                specialLuck += 2;
            }
            else if (weaponName == "Steam Laser Mk. III") {
                specialPower += 1500;
                specialLuck += 2;
            }
        } else if (locationName.indexOf("Gnawnian Express Station") >= 0) {
            if (weaponName == "Bandit Deflector" && phaseName.indexOf("Raider River") >= 0) specialPower += 1500;
            else if (weaponName == "Engine Doubler" && phaseName.indexOf("Daredevil Canyon") >= 0) specialPower += 1500;
            else if (weaponName == "Supply Grabber" && phaseName.indexOf("Supply Depot") >= 0) specialPower += 1500;
        } else if (locationName == "Derr Dunes" && charmName == "Derr Power Charm") {
            specialPower += 600;
            specialBonus += 5;
        } else if (locationName == "Nerg Plains" && charmName == "Nerg Power Charm") {
            specialPower += 600;
            specialBonus += 5;
        } else if (locationName == "Elub Shore" && charmName == "Elub Power Charm") {
            specialPower += 600;
            specialBonus += 5;
        } else if (locationName.indexOf("Fiery Warpath") >= 0) {
            if (charmName == "Flamebane Charm") {
                specialBonus += 150;
            }
            if (phaseName == "Wave 4" && weaponName == "Warden Slayer Trap") {
                specialPower += 2500;
                specialBonus += 2500;
            }
        } else if (locationName.indexOf("Toxic Spill") >= 0) {
            if (baseName == "Washboard Base") {
                specialBonus += 5;
                specialLuck += 5;
            }
            if (charmName == "Soap Charm") {
                specialPower += 5000;
                specialLuck += 10;
            } else if (charmName == "Super Soap Charm") {
                specialPower += 8000;
                specialLuck += 12;
            }
        } else if ((locationName == "Cape Clawed" || locationName == "Elub Shore" || locationName == "Nerg Plains" || locationName == "Derr Dunes") && baseName == "Tiki Base") {
            specialLuck += 6;
        } else if ((phaseName.indexOf("Icewing's Lair") >= 0 || phaseName.indexOf("Hidden Depths") >= 0 || phaseName.indexOf("The Deep Lair") >= 0) && baseName == "Deep Freeze Base") {
            specialPower += 665;
            specialLuck += 9;
        } else if (locationName == "Jungle of Dread" && weaponName == "Dreaded Totem Trap") {
            specialPower += 8500;
        } else if (locationName == "Sunken City" && baseName == "Depth Charge Base" && phaseName != "Docked") {
            specialPower += 1000;
        } else if (locationName == "Seasonal Garden" && baseName == "Seasonal Base") {
            specialBonus += 18;
        }

        if (cheeseName == "Limelight" && charmName == "Mining Charm") {
            specialBonus += 30;
        } else if (locationName == "Jungle of Dread" && charmName == "Dreaded Charm") {
            specialBonus += 300;
        } else if (cheeseName.indexOf("Fusion Fondue") >= 0 && charmName == "EMP400 Charm") {
            specialPower += 25000;
        }

        if (trapType.trim() == "Physical" && baseName == "Physical Brace Base") {
            braceBonus += .25;
        } else if ((baseName == "Polluted Base" || baseName == "Refined Pollutinum Base") && charmName.indexOf("Polluted Charm") >= 0) {
            if (charmName == "Polluted Charm") {
                specialLuck += 4;
            } else if (charmName == "Super Polluted Charm") {
                specialLuck += 6;
            } else if (charmName == "Extreme Polluted Charm") {
                specialLuck += 10;
            } else if (charmName == "Ultimate Polluted Charm") {
                specialLuck += 15;
            }
        }
        var riftCount = getRiftCount();

        if (riftCount == 2) {
            specialBonus += 10;
        } else if (riftCount == 3) {
            specialBonus += 10;
            specialLuck += 5;
        }

        /*
         * Battery Levels
         */
        if (typeof batteryPower == 'undefined') {
        }
        else if (batteryPower == 1) {
            specialPower += 90;
        }
        else if (batteryPower == 2) {
            specialPower += 500;
            specialLuck += 1;
        }
        else if (batteryPower == 3) {
            specialPower += 3000;
            specialLuck += 2;
        }
        else if (batteryPower == 4) {
            specialPower += 8500;
            specialLuck += 5;
        }
        else if (batteryPower == 5) {
            specialPower += 16000;
            specialLuck += 10;
        }
        else if (batteryPower == 6) {
            specialPower += 30000;
            specialLuck += 12;
        }
        else if (batteryPower == 7) {
            specialPower += 50000;
            specialLuck += 25;
        }
        else if (batteryPower == 8) {
            specialPower += 90000;
            specialLuck += 35;
        }
        else if (batteryPower == 9) {
            specialPower += 190000;
            specialLuck += 50;
        }
        else if (batteryPower == 10) {
            specialPower += 300000;
            specialLuck += 100;
        }

        if (charmName == "Forgotten Charm") {
            trapType = "Forgotten";
        } else if (charmName == "Nanny Charm") {
            trapType = "Parental";
        } else if (charmName == "Hydro Charm") {
            trapType = "Hydro";
        } else if (charmName == "Shadow Charm") {
            trapType = "Shadow";
        } else {
            trapType = weaponsArray[weaponName][0].trim();
        }

        if (weaponName == "Isle Idol Stakeshooter Skin") {
            trapType = "Tactical";
        } else if (weaponName == "Isle Idol Hydroplane Skin") {
            trapType = "Hydro";
        }

        var totalPower = weaponPower + basePower + charmPower + specialPower;
        var totalBonus = 1 + weaponBonus / 100 + baseBonus / 100 + charmBonus / 100 + specialBonus / 100 + cheeseBonus / 100;
        var totalPourBonus = 1 + pourBonus / 100 + pourBonus / 100 * (weaponBonus / 100 + baseBonus / 100 + charmBonus / 100);
        var ampBonus = ztAmp / 100 + braceBonus;
        trapPower = Math.round(totalPower * totalBonus * totalPourBonus * ampBonus);

        if (!parseInt(bonusLuck)) bonusLuck = 0;
        trapLuck = Math.floor((weaponLuck + baseLuck + parseInt(gsLuck) + charmLuck + parseInt(bonusLuck) + parseInt(pourLuck) + specialLuck) * Math.min(1, ampBonus));
        trapAtt = weaponAtt + baseAtt + charmAtt;
        if (trapAtt > 100) trapAtt = 100;
        trapEff = weaponEff + baseEff + charmEff;
        if (trapEff > 6) trapEff = 6;
        else if (trapEff < -6) trapEff = -6;

        if (user == CRE_USER && !skipDisp) {
            showPop(2);
            showTrapSetup();
        }
    } else showTrapSetup(0);
}

/**
 * Catch Rate calculation
 * Source: https://mhanalysis.wordpress.com/2011/01/05/mousehunt-catch-rates-3-0/
 * @param E Effectiveness
 * @param P Trap Power
 * @param L Trap Luck
 * @param M Mouse Power
 * @returns {number} Catch Rate Estimate
 */
function calcCR(E, P, L, M) {
    return Math.min((E * P + (3 - Math.min(E, 2)) * Math.pow((Math.min(E, 2) * L), 2)) / (E * P + M), 1);
}

function batteryChanged() {
    var input = document.getElementById("battery");
    var batteryLevel = input.value;
    batteryPower = parseInt(batteryLevel) || 0;

    if (batteryPower < 0)
        batteryPower = 0;
    else if (batteryPower > 10)
        batteryPower = 10;

    updateLink();

    if (user == CRE_USER)
        calculateTrapSetup();
}

var baselineArray = [];
function processBaseline(baselineText) {
    baselineArray = baselineText.split("\n");
    var baselineArrayLength = baselineArray.length;

    for (var i = 0; i < baselineArrayLength; i++) {
        baselineArray[i] = baselineArray[i].split("\t");

        baselineArray[baselineArray[i][0]] = parseFloat(baselineArray[i][1]);
    }

    baselineLoaded = 1;
    checkLoadState();

}

function findEff(mouseName) {
    var eff;
    if (trapType == '') eff = 0;
    else {
        eff = (powersArray[mouseName][typeEff[trapType]]) / 100;
    }
    return eff;
}

function getCheeseAttraction() {
    var baselineAtt = baselineAttArray[cheeseName] || baselineArray[locationName + " (" + cheeseName + ")"];
    return baselineAtt + trapAtt / 100 - trapAtt / 100 * baselineAtt;
}

function gsParamCheck() {
    var gsParameter = getURLParameter("gs");
    if (gsParameter != "null") {
        gsParameter = "No";
        var select = document.getElementById("gs");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == gsParameter) {
                child.selected = true;
                gsChanged();
                break;
            }
        }
    }
}

function toxicChanged() {
    var select = document.getElementById("toxic");
    isToxic = select.children[select.selectedIndex].innerHTML;

    if (isToxic == "Yes" && (cheeseName == "Brie" || cheeseName == "SB+")) {
        cheeseBonus = 20;
    }
    else {
        cheeseBonus = 0;
    }

    updateLink();
    calculateTrapSetup();
}

function populateSublocationDropdown(locationName) {
    var sublDropdown = document.getElementById("phase");
    var sublDropdownHTML = '';

    var sublocations = Object.keys(popArray[locationName] || []);
    for (var key in sublocations) {
        sublDropdownHTML += "<option>" + sublocations[key] + "</option>\n";
    }

    sublDropdown.innerHTML = sublDropdownHTML;
    phaseName = sublocations[0];

    var phaseParameter = getURLParameter("phase");
    if (phaseParameter != "null") {
        var select = document.getElementById("phase");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == phaseParameter) {
                child.selected = true;
                break;
            }
        }
    }

    loadCheeseDropdown();
    phaseChanged();
}

function charmChangeCommon() {
    updateLink();
    var charmsArrayN = charmsArray[charmName] || [0, 0, 0, 0, "No Effect"];
    if (specialCharm[charmName]) calcSpecialCharms(charmName);
    else {
        charmPower = charmsArrayN[0];
        charmBonus = charmsArrayN[1];
        charmAtt = charmsArrayN[2];
        charmLuck = charmsArrayN[3];
        charmEff = parseFreshness[charmsArrayN[4].trim()];
    }
}

function loadLocationDropdown() {
    var locationDropdown = document.getElementById("location");
    var locationDropdownHTML = '<option></option>';

    var locations = Object.keys(popArray || []);
    /* Safety, JS does not define iteration order */
    locations.sort();

    for (var key in locations) {
        locationDropdownHTML += "<option>" + locations[key] + "</option>\n";
    }

    locationDropdown.innerHTML = locationDropdownHTML;

    var locationParameter = getURLParameter("location");
    if (locationParameter != "null") {
        var select = document.getElementById("location");
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.innerHTML == locationParameter) {
                child.selected = true;
                locationChanged();
                break;
            }
        }
    }
}

function showTrapSetup(type) {
    var trapSetup = document.getElementById("trapSetup");

    if (type == 0) trapSetup.innerHTML = "<tr><td></td></tr>";
    else {
        trapSetup.innerHTML = "<tr><td>Type</td><td>" + trapType + "<tr><td>Power</td><td>" + commafy(trapPower) + "</td></tr><tr><td>Luck</td><td>" + trapLuck + "</td></tr><tr><td>Attraction Bonus</td><td>" + trapAtt + "%</td></tr><tr><td>Cheese Effect</td><td>" + reverseParseFreshness[trapEff] + "</td></tr>";
    }
}

function gsChanged() {
    var select = document.getElementById("gs");

    if (select.value == 'Y') gsLuck = 7;
    else gsLuck = 0;

    updateLink();
    calculateTrapSetup();
    //showPop();
}

function getIcebergBase() {
    var autoBase = '';
    var autoPhase = '';
    if (phaseName.indexOf("Magnet") >= 0) autoBase = "Magnet Base";
    else if (phaseName.indexOf("Hearthstone") >= 0) autoBase = "Hearthstone Base";

    else if ((phaseName == "Bombing Run"
        || phaseName == "The Mad Depths"
        || phaseName == "Treacherous Tunnels")
        && baseName == "Magnet Base") {
        autoBase = "";
    }

    else if (phaseName == "The Mad Depths"
        && baseName == "Hearthstone Base") autoBase = "";

    if (autoBase != "") {
        var selectBase = document.getElementById("base");
        selectBase.value = autoBase;
        baseChanged();
    }
}
function phaseChanged() {
    console.log("Phase changed");
    if (phaseName == "-") {
        $("#phaseRow").hide();
    }
    else {
        $("#phaseRow").show(500);
    }

    var select = document.getElementById("phase");
    phaseName = select.children[select.selectedIndex].innerHTML;

    getIcebergBase();

    if (locationName == "Twisted Garden"
        && phaseName == "Poured") {
        pourBonus = 5;
        pourLuck = 5;
        calculateTrapSetup();
    } else {
        pourBonus = 0;
        pourLuck = 0;
        calculateTrapSetup();
    }

    loadCheeseDropdown();
    updateLink();
}

function bonusLuckChanged() {
    var luckInput = document.getElementById("bonusLuck").value;

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
    if (toxicParameter != "null") {
        var select = document.getElementById("toxic");
        select.value = toxicParameter;
        toxicChanged();
    }
}

function showHideWidgets(custom) {
    $("#toxicRow").hide();
    $(".display-location").hide();
    $("#toxic").val('No');
    $("#battery").val('-');
    var locationNameClass = ".display-" + locationName.replace(/ /g, "-").replace(/'/g,"").toLowerCase();
    if (custom) {
        $(".comments " + locationNameClass).show(500);
        $(".display-custom" + locationNameClass).show(500);
    }
    else
    {
        $(locationNameClass).show(500);
    }
}