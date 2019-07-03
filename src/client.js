/********** Helpers **********/

/**
 * Load a JSON file from disk. If this does not work in a browser, 
 * this example is in big trouble!
 * @param {string} filename name (and path) of file to open, e.g., "src/data.json". Generally paths are relative to index.html
 * @returns {JSON} response as parsed JSON
 * @throws {ReferenceError} if cannot read the file
 */
const loadJsonFromDisk = async function(filename) {
    // labelled with async and declaring promise is redundant
    // but it does make the promise explicit and the callback on
    // XMLHttpRequest doesn't seem to support promise
    return new Promise((resolve, reject) => { 
        let request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", filename, true);
        request.onerror = function(error) {
            return reject(new ReferenceError("Could not read file '" + filename + "' from disk. Please check that it is present and you have permissions to the file."));
        }
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                if(request.status == 200) {
                    return resolve(JSON.parse(request.responseText));
                }
                else {
                    //return reject(new Error("Uh oh! Could not read file " + filename + " (status=" + request + ")"));
                }
            }
        }
        request.send(null);    
    });
}

/**
 * Prompts user to download a file
 * @param {JSON} content for file
 * @param {string} filename suggested filename
 */
const promptToDownloadJsonFile = function(content, filename) {
    let dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataString);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/********** HTML UI ***********/

/**
 * Build the navigation header. (Does not append it to the document.)
 * @param {JSON} config client configuration settings
 * @returns {HTMLElement} div containing full navigation
 */
const buildNavigation = function(config) {
    if(!config)
        throw new TypeError("config is required");
    if(!("app" in config))
        throw new TypeError("'app' key not in config")
    
    let appConfig = config["app"];

    let nav = document.createElement("div");
    nav.className = "w3-container w3-deep-purple";

    let header = document.createElement("h1");
    header.textContent = "Sample Client Sans Web Server"
    if("name" in appConfig) {
        header.textContent = appConfig["name"];
    }
    else {
        console.error("app.name key not found in config file");
    }
    nav.appendChild(header);

    let navBar = document.createElement("div");
    navBar.className = "w3-bar w3-sand w3-border-cyan w3-bottombar";
    nav.appendChild(navBar);

    if("features" in appConfig) {
        appConfig.features.forEach(function(feature) {
            let navLink = document.createElement("a");
            navLink.className = "w3-barb-item w3-button";
            navLink.textContent = feature.name;
            navLink.id = "nav-" + feature.id;
            navBar.appendChild(navLink);    
        });
    }
    else {
        console.error("app.features key not found in config");
    }
    
    return nav;
}

/********** Client ***********/
const runMe = async function() {
    let config = await loadJsonFromDisk("src/config.json");    
    console.debug("config file loaded", config);

    let data = await loadJsonFromDisk("src/data.json");
    console.debug("data file loaded", data);


    // promptToDownloadJsonFile(config, "src/config.json");
    // promptToDownloadJsonFile(data, "src/data.json");

    document.body.appendChild(buildNavigation(config));

}

runMe();
