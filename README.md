# [MH Tools by tsitu](https://github.com/tsitu/MH-Tools)

## To-do
* Update attraction rates for Labyrinth using SB+/Gouda/Brie + Glowing Gourd Charm

## Changelog (some details may be omitted - check the commit history)

#### June 21 2016
* Renamed items to match in-game names \[*General*\]

#### July 1 2016
* Updated Fiery Warpath populations with altering charms \[*General*\]
* Implemented interval for XHR call within setup bookmarklet \[*Setup*\]

#### June 28 2016
* Added 2016 Ronza items \[*General*\]
* Implemented various charm effects \[*General*\]

#### June 21 2016
* Added Best Setup bookmarklet amongst many other minor tweaks and fixes \[*Setup*\]

#### June 21 2016
* Fixed S.L.A.C. typo and popArrayLPC null check \[*CRE*\]
* Fixed bookmarklet parsing bug with histories over 1000 entries \[*Analyzer*\]
* Updated Furoma Rift mouse powers, added Attuned Enerchi Induction Base \[*CRE*\]

#### June 17 2016
* Added summary table and reset button \[*Analyzer*\]
* Updated populations and implemented checks to allow fused/unfused cheese/charm combinations to co-exist peacefully \[*CRE*\]

#### June 15 2016
* Initial public upload of Marketplace Analyzer \[*Analyzer*\]
* Migration to js-cookie \[*General*\]
* Implementations of localStorage \[*General*\]

#### June 14 2016
* Implemented per-hunt Labyrinth hallway and dead end clues \[*CRE*\]

#### June 13 2016
* Fixed some URLs and reverted tablesorter border color \[*General*\]
* Added District Dangers, Furoma Rift: Enter the Pagoda, Lost in the Labyrinth, Oxygen Collecting, Rift Undead Rising, Sunken Danger, Sunken Treasure Hunting, and Undead Rising tournaments \[*CRE*\]

#### June 12 2016
* Migrated to Mottie's tablesorter fork (with Pager and Filter widgets) \[*Setup*\]
* Implemented new tablesolver (with Filter) \[*CRE + Map*\]

#### June 11 2016
* Overhauled UI, with location mice sorted by raw AR \[*Map*\]
* Integrated Olaf's cookie and bookmarklet code \[*Map*\]

#### June 10 2016
* Adjusted Furoma Rift mouse power and effectiveness percentages \[*General*\]
* Implemented Furoma Rift battery levels, toxic checks, and ZT amplifier \[*Setup*\]
* Implemented pager plugin to navigate through rows \[*Setup*\]
* Optimized by implementing key events and delays (minimizing processMap function calls) \[*Setup*\]
* Added unique mice remaining field \[*Map*\]
* Implemented duplicate mouse check \[*Map*\]

#### June 8 2016
* Added mouse list column limiter \[*Map*\]
* Added tablesorter for Best Locations \[*Map*\]
* Implemented URLs to Best Setup tool \[*Map*\]
* Implemented Weighted Attraction Rate \[*Map*\]
* Added Best Location row limiter \[*Map*\]
* Added attraction bonus slider \[*Map*\]
* Significant population unfusing and touching up \[*General*\]

#### June 7 2016
* Added differentiation of fused cheese rates in, minor UI optimizations \[*Map*\]

#### May 23 2016
* Added accurate power effectiveness percentages for 13 Furoma Rift mice
* Implemented situational <tr> hiding
* Changed Zugzwang's Tower amplifier to a slider

#### May 21 2016
* Implemented Furoma Rift battery levels and added toxic/battery to URLString

#### May 20 2016
* Added initial Furoma Rift implementation

#### May 13 2016
* Added sample size descriptor
* Added Whisker Woods Rift attraction data and mice power/gold/points values

#### May 11 2016
* Fixed King's Gauntlet functionality
* Fixed Zokor boss mice catch rates

#### May 6 2016
* Added save/paste setup functionality (with Alt-C and Alt-V keybindings) to the tabbed demo

#### May 3 2016
* Updated populations CSV format and added new Zokor data
* Fixed automatic phase for Iceberg base interactions
* Added points/gold values for Zokor mice

#### Apr 23 2016
* Fixed White Cheddar attraction rate
* Fixed Coal Shoveller typo

#### Apr 1 2016
* Fixed Dreaded Charm behavior
* Added Isle Idol skin checks for power type
* Added check for '/' character in order to decide on commonCheeseIndex
* Added toxic check for Brie and SB+
* Fixed Mutated Behemoth typo in powersArray
* Added tabbed CRE demo: http://tsitu.github.io/MH-Tools/tabs.html

#### Mar 26 2016
* Fixed multiple special effects power type issues (Isle Idol + skin + charms)
* Added trap type row to setup results

#### Mar 25 2016
* Added charms: 2016, Extra Sweet Cupcake, Glowing Gourd, Hydro, Monkey Fling, Shadow, Super Regal, Treasure Trawling, Ultimate Anchor, and Ultimate Lucky Power
* Added feature to notify user if weapons/bases/charms have been added, which deletes any cookie set earlier
* Reverted 'index.html' to 'cre.html' for linking to setup in cre.js

#### Mar 22 2016
* Added Candy Crusher, Forgotten Presure Plate, and S.U.P.E.R. Scum Scrubber traps

#### Mar 16 2016
* Added Bubbles: The Party Crasher Trap and Extra Sweet Cupcake Birthday Base

#### Mar 15 2016
* Ported best setup calculator and added JQuery cookie to remember ticked values
* Added favicon and analytics to setup.html
* Added a check to untick 'All' if there are unticked boxes stored in cookie

#### Mar 10 2016
* Added a 100% ceiling to attraction rate

#### Mar 6 2016
* Added haoala's map solver and related scripts, as well as populations2.csv
* Added index page and related CSS/JS files, replacing Dropbox links with Github.io ones
* Added favicon and Google Analytics objects
* Fixed newlines affecting parsing and uncommented an onchange event (for map solver)

#### Mar 2 2016
* Fixed accent marks in Birthday Party Pinata and Birthday Dragee

#### Feb 28 2016
* Initial commit
* Added Refined Pollutinum, Monkey Jade, Depth Charge, and Tribal Kaboom bases

## Credits

* https://dl.dropboxusercontent.com/u/14589881/index.html (haoala's original tools)
* https://github.com/davidtmiller (Start Bootstrap)