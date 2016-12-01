javascript:void(function () {
    if (location.href.indexOf("mousehuntgame.com") < 0) {
        alert("You are not on mousehuntgame.com! Please try again.");
        return;
    }
    var userBase;
    function findSublocation() {
        var sublocation = "N/A";

        if (userLocation == "Balack's Cove") {
            var tide = user["viewing_atts"]["tide"];
            if (tide == "low") {
                sublocation = "Low Tide";
            }
            else if (tide == "medium") {
                sublocation = "Mid Tide";
            }
            else if (tide == "high") {
                sublocation = "High Tide";
            }
        }
        else if (userLocation == "Burroughs Rift") {
            var tier = user["quests"]["QuestRiftBurroughs"]["mist_tier"];
            if (tier == "tier_0") {
                sublocation = "Mist Level 0";
            }
            else if (tier == "tier_1") {
                sublocation = "Mist Level 1-5";
            }
            else if (tier == "tier_2") {
                sublocation = "Mist Level 6-18";
            }
            else if (tier == "tier_3") {
                sublocation = "Mist Level 19-20";
            }
        }
        else if (userLocation == "Claw Shot City") {
            // Not viable? Available data: map_active, phase lawless
        }
        else if (userLocation == "Cursed City") {
            if (user["quests"]["QuestLostCity"]["minigame"]["is_cursed"] == true) {
                sublocation = "Cursed";
            }
        }
        else if (userLocation == "Fiery Warpath") {
            //Single digit string - "1", "2", "3", "4"
            var wave = user["viewing_atts"]["desert_warpath"]["wave"];
            sublocation = "Wave " + wave;
        }
        else if (userLocation == "Gnawnian Express Station") {
            var onTrain = user["quests"]["QuestTrainStation"]["on_train"];
            if (onTrain == true) {
                var stageName = user["viewing_atts"]["tournament"]["minigame"]["name"];
                if (stageName == "Supply Depot") {
                    var supplyHoarder = user["viewing_atts"]["tournament"]["minigame"]["supply_hoarder_turns"];
                    if (supplyHoarder > 0) {
                        sublocation = "Supply Depot (Supply Rush)";
                    }
                    else if (supplyHoarder == 0) {
                        sublocation = "Supply Depot (No Supply Rush)";
                    }
                }
                else if (stageName == "Raider River" || stageName == "Daredevil Canyon") {
                    sublocation = stageName;
                }
            }
        }
        else if (userLocation == "Iceberg") {
            sublocation = user["quests"]["QuestIceberg"]["current_phase"];
            if (sublocation == "General") {
                sublocation = "Generals";
            }
            if ((sublocation == "Treacherous Tunnels" || sublocation == "Bombing Run" || sublocation == "The Mad Depths")
                && userBase == "Magnet Base") {
                sublocation += " (Magnet)";
            }
            else if (sublocation == "The Mad Depths" && userBase == "Hearthstone Base") {
                sublocation += " (Hearthstone)";
            }
        }
        else if (userLocation == "Labyrinth") {
            var hallwayName = user["quests"]["QuestLabyrinth"]["hallway_name"];
            var length = "";
            if (hallwayName.indexOf("Short") >= 0) hallwayName = hallwayName.slice(6, hallwayName.length);
            else if (hallwayName.indexOf("Medium") >= 0) hallwayName = hallwayName.slice(7, hallwayName.length);
            else if (hallwayName.indexOf("Long") >= 0) hallwayName = hallwayName.slice(5, hallwayName.length);
            hallwayName = hallwayName.slice(0, hallwayName.indexOf(" Hallway"));
            sublocation = hallwayName;
        }
        else if (userLocation == "Living Garden") {
            if (user["quests"]["QuestLivingGarden"]["minigame"]["bucket_state"] == "dumped") {
                sublocation = "Poured";
            }
        }
        else if (userLocation == "Lost City") {
            if (user["quests"]["QuestLostCity"]["minigame"]["is_cursed"] == 1) {
                sublocation = "Cursed";
            }
        }
        else if (userLocation == "Sand Dunes") {
            if (user["quests"]["QuestSandDunes"]["minigame"]["has_stampede"] == true) {
                sublocation = "Stampede";
            }
        }
        else if (userLocation == "Seasonal Garden") {
            var season = user["viewing_atts"]["season"];
            if (season == "fl") {
                sublocation = "Fall";
            }
            else if (season == "wr") {
                sublocation = "Winter";
            }
            else if (season == "sg") {
                sublocation = "Spring";
            }
            else if (season == "sr") {
                sublocation = "Summer";
            }
        }
        else if (userLocation == "Sunken City") {
            sublocation = user["quests"]["QuestSunkenCity"]["zone_name"];
            if (sublocation == "Sunken City") {
                sublocation = "Docked";
            }
        }
        else if (userLocation == "Toxic Spill") {
            if (userRank == "Archduke" || userRank == "Archduchess") {
                sublocation = "Archduke/Archduchess";
            }
            else if (userRank == "Grand Duke" || userRank == "Grand Duchess") {
                sublocation = "Grand Duke/Grand Duchess";
            }
            else if (userRank == "Duke" || userRank == "Duchess") {
                sublocation = "Duke/Duchess";
            }
            else if (userRank == "Count" || userRank == "Countess") {
                sublocation = "Count/Countess";
            }
            else if (userRank == "Baron" || userRank == "Baroness") {
                sublocation = "Baron/Baroness";
            }
            else if (userRank == "Lord" || userRank == "Lady") {
                sublocation = "Lord/Lady";
            }
            else if (userRank == "Knight" || userRank == "Hero") {
                sublocation = userRank;
            }
        }
        else if (userLocation == "Twisted Garden") {
            if (user["quests"]["QuestLivingGarden"]["minigame"]["vials_state"] == "dumped") {
                sublocation = "Poured";
            }
        }
        else if (userLocation == "Whisker Woods Rift") {
            var zones = user["quests"]["QuestRiftWhiskerWoods"]["zones"];
            var clearing = zones["clearing"]["status"];
            var tree = zones["tree"]["status"];
            var lagoon = zones["lagoon"]["status"];
            var state = "";
            state += clearing + "/" + tree + "/" + lagoon;
            state = state.replace(/low/g, "Low");
            state = state.replace(/high/g, "Medium");
            state = state.replace(/boss/g, "High");
            sublocation = state;
        }
        else if (userLocation == "Zokor") {
            /**
             var district = user["quests"]["QuestAncientCity"]["district_name"];
             if (district == "The Tech Manaforge") {
                sublocation = "Manaforge Smith"; //remove "Smith"
            }
             else if (district == "The Farming Garden") {
                sublocation = "Farming Garden";
            }
             else if (district == "The Overgrown Farmhouse") {
                sublocation = "Overgrown Farmhouse";
            }
             else if (district == "The Treasure Vault") {
                sublocation = "Treasure Vault";
            }
             // More else ifs
             */
            var quest = user["quests"]["QuestAncientCity"];

            var districtname = quest.district_name;
            var district_type = quest.clue_name;
            var district_tier = quest.district_tier;

            //TODO: Check cluename/cluetype of Lair to improve this
            if (districtname.indexOf("Minotaur") >= 0) {
                sublocation = "Lair of the Minotaur"
            } else {
                var districts = {
                    "Tech": ["Tech Foundry Outskirts", "Research Center", "Manaforge Smith"],
                    "Scholar": ["Neophyte Scholar Study", "Master Scholar Auditorium", "Dark Libary"],
                    "Fealty": ["Outer Fealty Shrine", "Inner Fealty Temple", "Templar's Sanctum"],
                    "Treasury": ["Treasure Room", "Treasure Vault"],
                    "Farming": ["Farming Garden", "Overgrown Farmhouse"]
                };

                sublocation = districts[district_type][district_tier - 1]
            }
        }
        else if (userLocation == "Zugzwang's Tower") {
            var mystic = user["viewing_atts"]["zzt_mage_progress"];
            var tech = user["viewing_atts"]["zzt_tech_progress"];
            if (mystic >= tech) {
                if (mystic >= 0 && mystic < 8) {
                    sublocation = "Mystic Pawn Pincher";
                }
                else if (mystic >= 8 && mystic < 10) {
                    sublocation = "Mystic Knights";
                }
                else if (mystic >= 10 && mystic < 12) {
                    sublocation = "Mystic Bishops";
                }
                else if (mystic >= 12 && mystic < 14) {
                    sublocation = "Mystic Rooks";
                }
                else if (mystic == 14) {
                    sublocation = "Mystic Queen";
                }
                else if (mystic == 15) {
                    sublocation = "Mystic King";
                }
                else if (mystic >= 16) {
                    sublocation = "Chess Master";
                }
            }
            else {
                if (tech >= 0 && tech < 8) {
                    sublocation = "Technic Pawn Pincher";
                }
                else if (tech >= 8 && tech < 10) {
                    sublocation = "Technic Knights";
                }
                else if (tech >= 10 && tech < 12) {
                    sublocation = "Technic Bishops";
                }
                else if (tech >= 12 && tech < 14) {
                    sublocation = "Technic Rooks";
                }
                else if (tech == 14) {
                    sublocation = "Technic Queen";
                }
                else if (tech == 15) {
                    sublocation = "Technic King";
                }
                else if (tech >= 16) {
                    sublocation = "Chess Master";
                }
            }
        }


        return sublocation;
    }


    if (!user) { /* Handles null and undefined */
        alert("User object not found.");
        return;
    }

    /**
     * Controls the names and values placed in URL
     */
    var urlParams = {};

    // Some items may not correspond 1:1 with CRE (e.g. SB+)
    var userRank = user["title_name"];
    var userLocation = user["location"];
    urlParams["location"] = userLocation;

    var userCheese = user["bait_name"];
    urlParams["weapon"] = user["weapon_name"];

    userBase = user["base_name"];
    urlParams["base"] = userBase;

    urlParams["charm"] = user["trinket_name"];
    if (!user["has_shield"]) {
        urlParams["gs"] = "No";
    }
    var luck_element = document.querySelector(".campPage-trap-trapStat.luck > .value");
    urlParams["totalluck"] = luck_element && luck_element.textContent ? Number(luck_element.textContent) : user["trap_luck"];
    var userSublocation = findSublocation();

    if (userLocation == "Furoma Rift") {
        var chargeLevel = user["quests"]["QuestRiftFuroma"]["droid"]["charge_level"];
        if (chargeLevel != "") {
            /*Replaced if-else with dictionary lookup -- less code*/
            var levels = {
                "charge_level_one": 1,
                "charge_level_two": 2,
                "charge_level_three": 3,
                "charge_level_four": 4,
                "charge_level_five": 5,
                "charge_level_six": 6,
                "charge_level_seven": 7,
                "charge_level_eight": 8,
                "charge_level_nine": 9,
                "charge_level_ten": 10
            };
            urlParams["battery"] = levels[chargeLevel];
        }
    }

    if (userLocation == "Labyrinth") {
        if (user["quests"]["QuestLabyrinth"]["lantern_status"] == "active") {
            /* Set url param directly instead of using temp variable */
            urlParams["oil"] = "On";
        }
    }

    if (document.querySelector("div.tournamentStatusHud") != null) {
        var tourney = user["viewing_atts"]["tournament"];
        if (tourney["status"] == "active" || tourney["status"] == "pending") {
            /* Set url param directly instead of using temp variable */
            urlParams["tourney"] = tourney["name"];
        }
    }

    // Cheese edge cases
    if (userCheese.indexOf("Toxic") >= 0) {
        userCheese = userCheese.slice(6, userCheese.length);
        urlParams["toxic"] = "Yes";
    }

    if (userCheese.indexOf("SUPER|brie+") >= 0) {
        userCheese = "SB+";
    } else if (userCheese.indexOf(" Cheese") >= 0) {
        if (userCheese.indexOf("Gauntlet") >= 0) {
            userCheese = userCheese.slice(16, userCheese.length);
            userSublocation = userCheese;
        }
        else {
            userCheese = userCheese.slice(0, userCheese.indexOf(" Cheese"));
        }
    }
    urlParams["cheese"] = userCheese;

    if (userSublocation != "N/A") {
        urlParams["phase"] = userSublocation;
    }

    if (userLocation == "Zugzwang's Tower") {
        urlParams["amplifier"] = user["viewing_atts"]["zzt_amplifier"];
    }

    var url = "https://tsitu.github.io/MH-Tools/cre.html?";
    // url = "http://localhost:63342/MH-Tools-Fork/cre.html?";
    // Build URL with loop instead of everything separately
    for (var key in urlParams) {
        //Server side changed to decode Component, makes 'if' here unnecessary
        var value = encodeURIComponent(urlParams[key]);
        url += key + "=" + value + "&"
    }

    var newWindow = window.open(url, 'mhcre');
})();