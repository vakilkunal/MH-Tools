javascript:void(function() {
	var url = "http://tsitu.github.io/MH-Tools/analyzer.html?data=";
	var sellString = "div.history-details .dataTable .sell";
	var buyString = "div.history-details .dataTable .buy";
	var initPage = parseInt(document.querySelector("div.history-details .paginate_button.current").innerHTML);
	var entries = document.querySelector("div.history-details .dataTables_info").innerHTML;
    var entriesSlice = parseInt(entries.slice(entries.indexOf("entries")-3, entries.indexOf("entries")));
    var totalPages = Math.ceil(entriesSlice/10);
    var entriesNum = totalPages-initPage+1;
    var counter = 0;
    var newWindow = window.open('http://tsitu.github.io/MH-Tools/analyzerwaiting.html', '_blank');

    var interval = setInterval(function() {
        var a = document.querySelector("div.history-details .paginate_button.next");
        if (a.className.indexOf("disabled") < 0 || parseInt(document.querySelector("div.history-details .paginate_button.current").innerHTML) == totalPages) {
        	var sell = document.querySelectorAll(sellString + " .sorting_1, " + sellString + " .item-name, " + sellString + " .numeric.quantity, " + sellString + " .numeric, " + sellString + " .numeric.total");
		    var buy = document.querySelectorAll(buyString + " .sorting_1, " + buyString + " .item-name, " + buyString + " .numeric.quantity, " + buyString + " .numeric, " + buyString + " .numeric.total");

		    var sellArr = [];
		    var buyArr = [];

		    for (var i=0; i<sell.length/5; i++) {
		    	if (i == 0) {
		    		sellArr.push("Sell " + sell[i].textContent + " " + (sell[i+1].textContent.split(" ").length) + " " + sell[i+1].textContent + " " + sell[i+2].textContent + " " + sell[i+3].textContent + " " + sell[i+4].textContent);
		    	}
		        else {
		        	sellArr.push("Sell " + sell[i*5].textContent + " " + (sell[i*5+1].textContent.split(" ").length) + " " + sell[i*5+1].textContent + " " + sell[i*5+2].textContent + " " + sell[i*5+3].textContent + " " + sell[i*5+4].textContent);
		    	}
		    }

		    for (var i=0; i<buy.length/5; i++) {
		        if (i == 0) {
		    		buyArr.push("Buy " + buy[i].textContent + " " + (buy[i+1].textContent.split(" ").length) + " " + buy[i+1].textContent + " " + buy[i+2].textContent + " " + buy[i+3].textContent + " " + buy[i+4].textContent);
		    	}
		        else {
		        	buyArr.push("Buy " + buy[i*5].textContent + " " + (buy[i*5+1].textContent.split(" ").length) + " " + buy[i*5+1].textContent + " " + buy[i*5+2].textContent + " " + buy[i*5+3].textContent + " " + buy[i*5+4].textContent);
		    	}
		    }

		    if (sellArr.length > 0) {
		        url += encodeURI(sellArr.join('/'));
		        url += "/";
		    }

		    if (buyArr.length > 0) {
		        url += encodeURI(buyArr.join('/'));
		        url += "/";
		    }

            a.click();
        }
        counter++;
        if (counter === entriesNum || a.className.indexOf("disabled") >= 0 || a == null) {
        	newWindow.location = url;
            clearInterval(interval);
        }
    }, 1000);
})();