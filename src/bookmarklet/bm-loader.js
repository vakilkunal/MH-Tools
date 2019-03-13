(function() {
  localStorage.setItem("tsitu-latest-sha", 0);

  getLatestSHA().then(function(response) {
    if (JSON.parse(response)[0] !== undefined) {
      var sha = JSON.parse(response)[0].sha;
      localStorage.setItem("tsitu-latest-sha", sha);

      // Load bookmarklet-menu based on SHA
      var el = document.createElement("script");
      var cdn =
        "https://cdn.jsdelivr.net/gh/tsitu/MH-Tools@" +
        sha +
        "/src/bookmarklet/bm-menu.min.js";
      el.src = cdn;
      document.body.appendChild(el);
      el.onload = function() {
        el.remove();
      };
    }
  });

  function getLatestSHA() {
    // Fetch latest gh-pages commit SHA to use with jsDelivr CDN since it caches URLs permanently
    return new Promise(function(resolve, reject) {
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
  }
})();
