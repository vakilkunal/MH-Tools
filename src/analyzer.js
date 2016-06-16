"use strict";

window.onload = function () {

	//Initialize tablesorter, bind to table
	$.tablesorter.defaults.sortInitialOrder = 'desc';
    $("#table").tablesorter({
		sortReset: true,
		widthFixed: true,
		ignoreCase: false,
		widgets: ["filter", "pager"],
		widgetOptions: {
			filter_childRows : false,
			filter_childByColumn : false,
			filter_childWithSibs : true,
			filter_columnFilters : true,
			filter_columnAnyMatch: true,
			filter_cellFilter : '',
			filter_cssFilter : '', // or []
			filter_defaultFilter : {},
			filter_excludeFilter : {},
			filter_external : '',
			filter_filteredRow : 'filtered',
			filter_formatter : null,
			filter_functions : null,
			filter_hideEmpty : true,
			filter_hideFilters : true,
			filter_ignoreCase : true,
			filter_liveSearch : true,
			filter_matchType : { 'input': 'exact', 'select': 'exact' },
			filter_onlyAvail : 'filter-onlyAvail',
			filter_placeholder : { search : 'Filter results...', select : '' },
			filter_reset : 'button.reset',
			filter_resetOnEsc : true,
			filter_saveFilters : false,
			filter_searchDelay : 420,
			filter_searchFiltered: true,
			filter_selectSource  : null,
			filter_serversideFiltering : false,
			filter_startsWith : false,
			filter_useParsedData : false,
			filter_defaultAttrib : 'data-value',
			filter_selectSourceSeparator : '|',pager_output: '{startRow:input} to {endRow} of {totalRows} rows', // '{page}/{totalPages}'
	        
	        pager_updateArrows: true,
	        pager_startPage: 0,
	        pager_size: 10,
	        pager_savePages: false,
	        pager_fixedHeight: false,
	        pager_removeRows: false, // removing rows in larger tables speeds up the sort
	        pager_ajaxUrl: null,
	        pager_customAjaxUrl: function(table, url) { return url; },
	        pager_ajaxError: null,
	        pager_ajaxObject: {
	          dataType: 'json'
	        },
	        pager_ajaxProcessing: function(ajax){ return [ 0, [], null ]; },
	        // css class names that are added
	        pager_css: {
	          container   : 'tablesorter-pager',    // class added to make included pager.css file work
	          errorRow    : 'tablesorter-errorRow', // error information row (don't include period at beginning); styled in theme file
	          disabled    : 'disabled'              // class added to arrows @ extremes (i.e. prev/first arrows "disabled" on first page)
	        },
	        // jQuery selectors
	        pager_selectors: {
	          container   : '.pager',       // target the pager markup (wrapper)
	          first       : '.first',       // go to first page arrow
	          prev        : '.prev',        // previous page arrow
	          next        : '.next',        // next page arrow
	          last        : '.last',        // go to last page arrow
	          gotoPage    : '.gotoPage',    // go to page selector - select dropdown that sets the current page
	          pageDisplay : '.pagedisplay', // location of where the "output" is displayed
	          pageSize    : '.pagesize'     // page size selector - select dropdown that sets the "size" option
	        }
		}
	}).bind('pagerChange pagerComplete pagerInitialized pageMoved', function(e, c){
      var p = c.pager, // NEW with the widget... it returns config, instead of config.pager
        msg = '"</span> event triggered, ' + (e.type === 'pagerChange' ? 'going to' : 'now on') +
        ' page <span class="typ">' + (p.page + 1) + '/' + p.totalPages + '</span>';
      $('#display')
        .append('<li><span class="str">"' + e.type + msg + '</li>')
        .find('li:first').remove();
    });

	var dataObject = {};
	var rawDataArray = getDataFromURL(window.location.search.match(/data=([^&]*)/));

    if (rawDataArray.length === 0) {
        var storedData = localStorage.getItem("marketplaceData");
        if (typeof storedData !== 'undefined') {
            dataObject = JSON.parse(storedData);
            showTable(dataObject);
        }
    }
    else {
    	$("#almostDone").show(500);
        processRawData(rawDataArray);
    }
}

function processRawData(rawDataArray) {
    var dataObject = {};

    var dataLen = rawDataArray.split("\n").length - 1;
    var dataSplit = rawDataArray.split("\n");
    for (var i=0; i<dataLen; i++) {
    	var rowSplit = dataSplit[i].split(" ");
    	var wordCount = parseInt(rowSplit[3]);
    	var word = '';
    	for (var j=1; j<wordCount; j++) {
    		word += rowSplit[j+3] + " ";
    	}
    	word += rowSplit[wordCount+3];

    	if (dataObject[word] == undefined) {
    		dataObject[word] = {};
    	}
    	if (dataObject[word][rowSplit[0]] == undefined) {
    		dataObject[word][rowSplit[0]] = {};
    	}
    	if (dataObject[word][rowSplit[0]][rowSplit[1] + " " + rowSplit[2]] == undefined) {
    		dataObject[word][rowSplit[0]][rowSplit[1] + " " + rowSplit[2]] = [];
    	}
    	dataObject[word][rowSplit[0]][rowSplit[1] + " " + rowSplit[2]].push(rowSplit[wordCount+4]);
    	dataObject[word][rowSplit[0]][rowSplit[1] + " " + rowSplit[2]].push(rowSplit[wordCount+5]);
    	dataObject[word][rowSplit[0]][rowSplit[1] + " " + rowSplit[2]].push(rowSplit[wordCount+6]);
    }

	// console.log(dataObject);

	//Store data in local storage
	if (Object.size(dataObject) > 0) {
		localStorage.setItem("marketplaceData", JSON.stringify(dataObject));
	    setTimeout(function() {
	    	window.location.replace("http://tsitu.github.io/MH-Tools/analyzer.html");
	    }, 500);
	}
}

function showTable(dataObject) {
	$("#almostDone").hide();
	$("#pagerContainer").show(500);
	$("#tableContainer").show(500);
	var table = document.getElementById("table");
	table.innerHTML = '';
	var tableHTML = "<thead><tr><th id='dateClosed'>Date Closed</th><th>Item Name</th><th data-filter='false'>Action</th><th data-filter='false'>Quantity</th><th data-filter='false'>Unit Price</th><th data-filter='false'>Total</th></tr></thead><tbody>";
	for (var itemName in dataObject) {
		for (var action in dataObject[itemName]) {
			for (var date in dataObject[itemName][action]) {
				for (var i=0; i<dataObject[itemName][action][date].length/3; i++) {
					tableHTML += "<tr><td>" + date + "</td><td>" + itemName + "</td><td>" + action + "</td><td>" + dataObject[itemName][action][date][i*3] + "</td><td>" + dataObject[itemName][action][date][i*3+1] + "</td><td>" + dataObject[itemName][action][date][i*3+2] + "</td></tr>";
				}
			}
		}
	}
	tableHTML += "</tbody>";
	table.innerHTML = tableHTML;

	var resort = true, callback = function() {
    	var header = $("#dateClosed");
    	if (header.hasClass("tablesorter-headerAsc")) {
    		header.click();
    		header.click();
    	}
    	else if (header.hasClass("tablesorter-headerUnSorted")) {
    		header.click();
    	}
    };
	$("#table").trigger("updateAll", [ resort, callback ]);
}

/*
 * Utilities
 */
function getDataFromURL(parameters) {
    if (parameters) {
        parameters = decodeURI(parameters[1]);

        return parameters
            .split('/')
            .join('\n');
    } else {
        return [];
    }
}

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}