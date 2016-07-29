javascript:void(function() {
	if (location.href.indexOf("mousehuntgame.com") < 0) {
		alert("You are not on mousehuntgame.com! Please try again.");
		return;
	}

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
			var wave = user["viewing_atts"]["desert_warpath"]["wave"];
			if (wave == "1") {
				sublocation = "Wave 1";
			}
			else if (wave == "2") {
				sublocation = "Wave 2";
			}
			else if (wave == "3") {
				sublocation = "Wave 3";
			}
			else if (wave == "4") {
				sublocation = "Wave 4";
			}
		}
		else if (userLocation == "Gnawnian Express Station") {
			// No stage data. (on_train true/false)
		}
		else if (userLocation == "Iceberg") {
			sublocation = user["quests"]["QuestIceberg"]["current_phase"];
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
			// bucket_state filling/?
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
			// else if (season == "sg") {
			// 	sublocation = "Spring";
			// }
			// else if (season == "sr") {
			// 	sublocation = "Summer";
			// }
		}
		else if (userLocation == "Sunken City") {
			sublocation = user["quests"]["QuestSunkenCity"]["zone_name"];
			// Docked?
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
			// District names
			// Manaforge = The Tech Manaforge
		}
		else if (userLocation == "Zugzwang's Tower") {
			// Confirm chess master state
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
					sublocation = "Tech Pawn Pincher";
				}
				else if (tech >= 8 && tech < 10) {
					sublocation = "Tech Knights";
				}
				else if (tech >= 10 && tech < 12) {
					sublocation = "Tech Bishops";
				}
				else if (tech >= 12 && tech < 14) {
					sublocation = "Tech Rooks";
				}
				else if (tech == 14) {
					sublocation = "Tech Queen";
				}
				else if (tech == 15) {
					sublocation = "Tech King";
				}
				else if (tech >= 16) {
					sublocation = "Chess Master";
				}
			}
		}

		return sublocation;
	}

	if (user != null) {
		// console.log(user); //Type in inspector console
		// Some items may not correspond 1:1 with CRE (e.g. SB+)
		var userRank = user["title_name"];
		var userLocation = user["location"];
		var userCheese = user["bait_name"];
		var userWeapon = user["weapon_name"];
		var userBase = user["base_name"];
		var userCharm = user["trinket_name"];
		var userShield = user["has_shield"];
		var userSublocation = findSublocation();

		var userBattery = "N/A";
		if (userLocation == "Furoma Rift") {
			var chargeLevel = user["quests"]["QuestRiftFuroma"]["droid"]["charge_level"];
			if (chargeLevel != "") {
				if (chargeLevel == "charge_level_one") userBattery = 1;
				else if (chargeLevel == "charge_level_two") userBattery = 2;
				else if (chargeLevel == "charge_level_three") userBattery = 3;
				else if (chargeLevel == "charge_level_four") userBattery = 4;
				else if (chargeLevel == "charge_level_five") userBattery = 5;
				else if (chargeLevel == "charge_level_six") userBattery = 6;
				else if (chargeLevel == "charge_level_seven") userBattery = 7;
				else if (chargeLevel == "charge_level_eight") userBattery = 8;
				else if (chargeLevel == "charge_level_nine") userBattery = 9;
				else if (chargeLevel == "charge_level_ten") userBattery = 10;
			}
		}

		var userOil = "N/A";
		if (userLocation == "Labyrinth") {
			if (user["quests"]["QuestLabyrinth"]["lantern_status"] == "active") {
				userOil = "On";
			}
		}
		
		var userTourney = "N/A";
		if (document.querySelector("div.tournamentStatusHud") != null) {
			var tourney = user["viewing_atts"]["tournament"];
			if (tourney["status"] == "active" || tourney["status"] == "pending") {
				userTourney = tourney["name"];
			}
		}
	}
	else {
		alert("User object not found.");
		return;
	}

	// Cheese edge cases
	if (userCheese.indexOf("SUPER|brie+") >= 0) {
		userCheese = "SB+";
	}
	if (userCheese.indexOf(" Cheese") >= 0) {
		if (userCheese.indexOf("Gauntlet") >= 0) {
			userCheese = userCheese.slice(16, userCheese.length);
			userSublocation = userCheese;
		}
		else {
			userCheese = userCheese.slice(0, userCheese.indexOf(" Cheese"));
		}
	}
	
	var url = "http://tsitu.github.io/MH-Tools/cre.html?";
	url += "location=" + userLocation;
	if (userSublocation != "N/A") {
		url += "&phase=" + userSublocation;
	}
	url += "&cheese=" + userCheese;
	if (userCheese.indexOf("Toxic ") >= 0) {
		url += "&toxic=Yes";
	}
	if (userBattery != "N/A") {
		url += "&battery=" + userBattery;
	}
	if (userOil != "N/A") {
		url += "&oil=" + userOil;
	}
	url += "&weapon=" + userWeapon;
	url += "&base=" + userBase;
	url += "&charm=" + userCharm;
	if (userShield == false) {
		url += "&gs=No";
	}
	if (userTourney != "N/A") {
		url += "&tourney=" + userTourney;
	}

	var newWindow = window.open(url, '_blank');

	// Vintage DOM Inspection
	// var currRank = document.querySelector("a.mousehuntHud-userStat.title span.label");
	// var currLocation = document.querySelector("div.mousehuntHud-environmentName");
	// var currSublocation = "N/A";
	// var currCheese = document.querySelector("span.campPage-trap-baitName");
	// var currWeapon = document.querySelector("a.mousehuntHud-userStat.trap.weapon");
	// var currBase = document.querySelector("a.mousehuntHud-userStat.trap.base");
	// var currCharm = document.querySelector("a.mousehuntHud-userStat.trinket span.label");
	// var currShield = document.querySelector("a.mousehuntHud-shield.golden");
	// var currTourney = document.querySelector("div.tournamentStatusHud a.name");
	// if (currRank == null || currLocation == null || currCheese == null || currWeapon == null || 
	// 	currBase == null || currCharm == null || currShield == null) {
	// 	alert("Please ensure that you have FreshCoat enabled in Support -> User Preferences, then navigate to the Camp page!");
	// 	return;
	// }
	// currRank = currRank.innerHTML;
	// currLocation = currLocation.innerHTML;
	// currCheese = currCheese.innerHTML;
	// currWeapon = currWeapon.title;
	// currBase = currBase.title;
	// currCharm = currCharm.innerHTML;
})();