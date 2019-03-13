(() => {
  // Even if current execution fails, constant pushing means we have data to continue from
  // localStorage sample usage: 582 entries is 40.4 KB on MHG, 30.4 KB in tool
  // May use alternative storage method if 5 MB localStorage limit is reached by whales

  // Global obj
  const PARAMS = {};

  function ajaxCall(startIndex) {
    return new Promise((resolve, reject) => {
      const payload = {
        start: startIndex,
        action: "history",
        uh: user.unique_hash
      };

      $.post(
        "https://www.mousehuntgame.com/managers/ajax/users/marketplace.php",
        payload,
        null,
        "json"
      )
        .done(success => {
          if (success) {
            resolve(success);
          } else {
            reject("Error in POST response data");
          }
        })
        .fail(error => {
          reject(error);
        });
    });
  }

  function main() {
    if (!window.jQuery) {
      alert("Error: jQuery is not enabled on this page");
      return;
    }

    // ajaxCall(2); // Note: Index can be specific
    // Initial call to get number of total entries
    ajaxCall(0)
      .then(res => {
        PARAMS["total-records"] = res.recordsTotal;
        PARAMS["pause"] = false;
        buildUI();
      })
      .catch(error => {
        console.log(error);
      });
  }

  function processDiff(newData) {
    const storageData = localStorage.getItem("tsitu-analyzer-data");
    if (storageData) {
      const storedData = JSON.parse(storageData);
      const dataLength = newData.length;

      // Self-adjusts based on length of returned data array
      // URL encoding bug on %10 so we use a roundabout way
      let skipIndex =
        dataLength -
        (PARAMS["missing-entries"] -
          Math.floor(PARAMS["missing-entries"] / 10) * 10);

      if (skipIndex === 10) {
        skipIndex = 0; // Constrained to 0-9
      }
      for (let i = skipIndex; i < dataLength; i++) {
        storedData["data"].push(newData[i]);
      }

      localStorage.setItem("tsitu-analyzer-data", JSON.stringify(storedData));
      localStorage.setItem(
        "tsitu-analyzer-data-length",
        storedData["data"].length
      );
    } else {
      const storageObj = {};
      storageObj["data"] = newData;
      localStorage.setItem("tsitu-analyzer-data", JSON.stringify(storageObj));
      localStorage.setItem("tsitu-analyzer-data-length", newData.length);
    }
    refreshUI();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function processPages() {
    let startIndex = Math.floor(PARAMS["missing-pages"] - 1) * 10;
    const numIteration = PARAMS["missing-pages"];

    for (let i = 0; i < numIteration; i++) {
      if (startIndex < 0) break;
      if (PARAMS["pause"]) break;
      const data = await ajaxCall(startIndex);
      if (data.recordsTotal !== PARAMS["total-records"]) {
        // Update total records
        alert("New transactions(s) detected. Please re-click 'Fetch'!");
        PARAMS["total-records"] = data.recordsTotal;
        refreshUI();
        break;
      }
      const rev = data.data.reverse();
      startIndex -= 10;
      processDiff(rev);
      await sleep(500);
    }

    document.getElementById("mht-marketplace-analyzer-fetch").disabled = false;
    document.getElementById("mht-marketplace-analyzer-pause").disabled = true;
    PARAMS["pause"] = false;
    document.getElementById(
      "mht-marketplace-analyzer-background"
    ).hidden = true;
  }

  function buildUI() {
    const mainDiv = document.createElement("div");
    mainDiv.id = "mht-marketplace-analyzer";

    const closeButton = document.createElement("button");
    closeButton.textContent = "x";
    closeButton.onclick = function() {
      document.body.removeChild(mainDiv);
    };

    const titleSpan = document.createElement("span");
    titleSpan.style.fontSize = "15px";
    titleSpan.style.fontWeight = "bold";
    titleSpan.appendChild(document.createTextNode("Marketplace Analyzer"));

    const descriptionSpan = document.createElement("span");
    descriptionSpan.id = "mht-marketplace-analyzer-description";

    const backgroundSpan = document.createElement("span");
    backgroundSpan.innerHTML =
      "<br><br>Script is running in the background.<br>Feel free to browse in another tab!";
    backgroundSpan.id = "mht-marketplace-analyzer-background";
    backgroundSpan.hidden = true;

    const fetchButton = document.createElement("button");
    fetchButton.id = "mht-marketplace-analyzer-fetch";
    fetchButton.textContent = "Fetch";
    fetchButton.onclick = () => {
      if (PARAMS["missing-entries"] === 0 && PARAMS["missing-pages"] === 0) {
        alert(
          "All available data has been downloaded.\nPlease click 'Send To Tool', or 'Reset Data' if something has broken."
        );
      } else {
        fetchButton.disabled = true;
        pauseButton.disabled = false;
        backgroundSpan.hidden = false;
        processPages();
      }
    };

    const pauseButton = document.createElement("button");
    pauseButton.id = "mht-marketplace-analyzer-pause";
    pauseButton.textContent = "Pause";
    pauseButton.disabled = true;
    pauseButton.onclick = () => {
      PARAMS["pause"] = true;
    };

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send To Tool";
    sendButton.onclick = () => {
      const storedData = localStorage.getItem("tsitu-analyzer-data");
      if (storedData) {
        const newWindow = window.open("");
        newWindow.location = "https://tsitu.github.io/MH-Tools/analyzer.html";
        // newWindow.location = "http://localhost:8000/analyzer.html"; // Debug
        // 200 IQ method to transfer stringified data across origins
        newWindow.name = storedData;
      } else {
        alert("There is no data to send! Please click 'Fetch'");
      }
    };

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Data";
    resetButton.onclick = () => {
      const reset = confirm("Are you sure you want to reset the data on MHG?");
      if (reset) {
        const storedData = localStorage.getItem("tsitu-analyzer-data");
        if (storedData) {
          localStorage.removeItem("tsitu-analyzer-data");
          localStorage.removeItem("tsitu-analyzer-data-length");
          refreshUI();
        }
      }
    };

    mainDiv.appendChild(closeButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(titleSpan);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(descriptionSpan);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(sendButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(fetchButton);
    mainDiv.appendChild(document.createTextNode(" "));
    mainDiv.appendChild(pauseButton);
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(resetButton);
    mainDiv.appendChild(backgroundSpan);

    mainDiv.style.backgroundColor = "#F5F5F5";
    mainDiv.style.position = "fixed";
    mainDiv.style.zIndex = "9999";
    mainDiv.style.left = "40%";
    mainDiv.style.top = "88px";
    mainDiv.style.border = "solid 3px #696969";
    mainDiv.style.borderRadius = "20px";
    mainDiv.style.padding = "10px";
    mainDiv.style.textAlign = "center";
    document.body.appendChild(mainDiv);
    refreshUI();
  }

  function refreshUI() {
    let storedEntries = 0;
    const storageData = localStorage.getItem("tsitu-analyzer-data-length");
    if (storageData) {
      storedEntries = storageData;
    }

    const missingEntries = PARAMS["total-records"] - storedEntries;
    const missingPages = Math.ceil(missingEntries / 10);
    PARAMS["missing-entries"] = missingEntries;
    PARAMS["missing-pages"] = missingPages;

    const d = document.getElementById("mht-marketplace-analyzer-description");
    d.innerHTML = `Stored Entries: ${storedEntries}<br>Missing Entries: ${missingEntries}<br>Pages Remaining: ${missingPages}/${Math.ceil(
      PARAMS["total-records"] / 10
    )}<br>Data Remaining: ${Math.ceil(missingPages * 23.8)} KB`;
  }

  main();
})();
