(function() {
  var mainDiv = document.createElement("div");
  mainDiv.id = "mht-bookmarklet-loader";
  // var rateLimitString = '';

  var closeButton = document.createElement("button", { id: "close-button" });
  closeButton.textContent = "x";
  closeButton.onclick = function() {
    document.body.removeChild(mainDiv);
  };

  var titleSpan = document.createElement("span");
  titleSpan.style.fontSize = "15px";
  titleSpan.style.fontWeight = "bold";
  titleSpan.appendChild(document.createTextNode("MH Tools Bookmarklets"));

  var descriptionSpan = document.createElement("span");
  descriptionSpan.innerHTML =
    "Version 1.0 / Using <a href='https://rawgit.com' target='blank'>RawGit</a>";

  var creButton = document.createElement("button", { id: "cre-button" });
  creButton.textContent = "Catch Rate Estimator";
  creButton.onclick = function() {
    loadBookmarklet("cre");
  };

  var mapButton = document.createElement("button", { id: "map-button" });
  mapButton.textContent = "Map Solver";
  mapButton.onclick = function() {
    loadBookmarklet("map");
  };

  var setupButton = document.createElement("button", { id: "setup-button" });
  setupButton.textContent = "Best Setup";
  setupButton.onclick = function() {
    loadBookmarklet("setup");
  };

  var analyzerButton = document.createElement("button", {
    id: "analyzer-button"
  });
  analyzerButton.textContent = "Marketplace Analyzer";
  analyzerButton.onclick = function() {
    loadBookmarklet("analyzer");
  };

  var crownButton = document.createElement("button", { id: "crown-button" });
  crownButton.textContent = "Silver Crown Solver";
  crownButton.onclick = function() {
    loadBookmarklet("crown");
  };

  // getRateLimit();
  function buildUI() {
    mainDiv.appendChild(closeButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(titleSpan);
    mainDiv.appendChild(document.createElement("br"));
    // mainDiv.appendChild(document.createTextNode(rateLimitString));
    mainDiv.appendChild(descriptionSpan);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(creButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(mapButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(setupButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(analyzerButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(crownButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createTextNode("(Drag me around on a PC)"));

    mainDiv.style.backgroundColor = "#F5F5F5";
    mainDiv.style.position = "absolute";
    mainDiv.style.zIndex = "9999";
    mainDiv.style.left = "25%";
    mainDiv.style.top = "25px";
    mainDiv.style.border = "solid 3px #696969";
    mainDiv.style.borderRadius = "20px";
    mainDiv.style.padding = "10px";
    mainDiv.style.textAlign = "center";
    document.body.appendChild(mainDiv);
    dragElement(document.getElementById("mht-bookmarklet-loader"));
  }
  buildUI();

  // Web API has a 60 request per hour rate limit - bookmarklet seems immune
  // function getRateLimit() {
  //   var jsonApi = new Promise(function(resolve, reject) {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open('GET', 'https://api.github.com/rate_limit');
  //     xhr.onload = function() {
  //       resolve(xhr.responseText);
  //     }
  //     xhr.onerror = function() {
  //       reject(xhr.statusText);
  //     }
  //     xhr.send();
  //   });

  //   jsonApi.then(function(response) {
  //     var parse = JSON.parse(response);
  //     var remain = parse.rate.remaining;
  //     var reset = parse.rate.reset;
  //     reset -= (Date.now() / 1000);
  //     reset /= 60;
  //     reset = reset.toFixed();
  //     rateLimitString = 'Requests remaining: ' + remain + ' / Resets in: ' + reset + ' minutes';
  //     buildUI();
  //   });
  // }

  function loadBookmarklet(type) {
    // Fetch latest gh-pages commit SHA to use with RawGit CDN since it caches URLs permanently
    var jsonApi = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://api.github.com/repos/tsitu/MH-Tools/commits?sha=gh-pages"
      );
      xhr.onload = function() {
        resolve(xhr.responseText);
      };
      xhr.onerror = function() {
        reject(xhr.statusText);
      };
      xhr.send();
    });

    jsonApi.then(function(response) {
      var sha = JSON.parse(response)[0].sha;
      var el = document.createElement("script");
      var cdn = "https://cdn.rawgit.com/tsitu/MH-Tools/";
      cdn += sha + "/src/bookmarklet/" + type + "bookmarklet.min.js";
      el.src = cdn;
      document.body.appendChild(el);
    });
  }

  function dragElement(el) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(el.id + "header")) {
      document.getElementById(el.id + "header").onmousedown = dragMouseDown;
    } else {
      el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
})();
