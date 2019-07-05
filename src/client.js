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
 * @param {JSON} config client configuration settings
 * @param {HTMLElement} parentElement element to which to add the navigation (via appendChild)
 * @returns {HTMLElement} div ready for content
 */
const buildContentContainer = function(config, parentElement) {
    let container = document.createElement("div");
    container.id = "content-main";
    container.className = "w3-container"

    parentElement.appendChild(container);

    return container;
}

/**
 * Retrieve and clear the main content container
 */
const clearContentContainer = function() {
    // TODO prompt if unsaved changes?
    const content = document.querySelector("#content-main");
    content.innerHTML = '';
    content.className = "w3-container";
    console.log("cleared content", content);
    return content;
}

/**
 * Build the form elements (UI)
 * @param {JSON} config client configuration settings
 * @param {HTMLElement} parentElement element to which to add the navigation (via appendChild)
 * @returns {HTMLElement}
 */
const buildForm = function(config, parentElement) {
    if(!config)
        throw new TypeError("config is required");
    if(!("attributes" in config))
        throw new TypeError("'attributes' key not in config");
    if(!("general" in config["attributes"]))
        throw new TypeError("'general' key not in config.attributes");
    // specific attributes not required

    /**
     * Build a form input field
     * @param {Object} attr attribute definition to create. Must contain: id, type, name at a minimum
     * @returns {HTMLElement} div containing the inquiry
     */
    const buildInput = function(attr) {
        let row = document.createElement("div");
        row.className = "w3-container";

        let lbl = document.createElement("label");
        lbl.for = attr.id;
        lbl.textContent = attr.name;
        lbl.className = "w3-text-deep-purple";

        row.appendChild(lbl);

        let input = null;
        switch(attr["type"]) {
            case "select":
                input = document.createElement("select");
                input.className = "w3-select";

                attr["options"].forEach(option => {
                    let selectOption = document.createElement("option");
                    selectOption.value = option["id"];
                    selectOption.textContent = option["name"];
                    input.appendChild(selectOption);
                });

                if(input.length <= 1) {
                    input.disabled = true;
                }
        
                break;
            case "string":
                input = document.createElement("input");
                input.className = "w3-input";
                input.type = "text";

                break;
            case "text":
                input = document.createElement("textarea");
                input.className = "w3-input";
                input.rows = 4;
                break;
            case "date":
                input = document.createElement("input");
                input.className = "w3-input";
                input.type = "date";
                break;
            default:
                // TODO error
                console.error("Unsupported attribute type for form", attr["type"], attr);

                // mimic string
                input = document.createElement("input");
                input.className = "w3-input";
                input.type = "text";

        }

        // handle common to all input settings
        input.id = attr.id;
        input.classList.add("w3-border");
        input.classList.add("w3-text-indigo");
        input.classList.add("w3-round-large");

        if(attr["required"])
            input.required = true;

        row.appendChild(input);
        return row;
    };

    let form = document.createElement("form");
    form.className = "w3-container";

    config["attributes"]["general"].forEach(attr => {
        form.appendChild(buildInput(attr));
    });

    if("platforms" in config) {
        form.appendChild(buildInput({
            "id": "platform",
            "name": "Platform",
            "type": "select",
            "options": config["platforms"]
        }));
    }
    if("specific" in config["attributes"]) {
        // TODO trigger this on platform change
    }

    parentElement.appendChild(form);

    return form;
}

/**
 * Build the navigation header. (Does not append it to the document.)
 * @param {JSON} config client configuration settings
 * @param {HTMLElement} parentElement element to which to add the navigation (via appendChild)
 * @returns {HTMLElement} div containing full navigation
 */
const buildNavigation = function(config, parentElement) {
    if(!config)
        throw new TypeError("config is required");
    if(!("app" in config))
        throw new TypeError("'app' key not in config");

    if(!parentElement)
        throw new TypeError("parentElement is required");
    
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

    parentElement.appendChild(nav);

    parentElement.querySelector("a#nav-home").addEventListener("click", function() {
        console.log("home clicked");

        const text = document.createElement("p");
        text.textContent = "Home";

        const home = document.createElement("div");
        home.className = "w3-panel";
        home.appendChild(text);

        // TODO other content for 'home'? 
        // Just do an iframe to a static page?

        clearContentContainer().appendChild(home);
    });
    parentElement.querySelector("a#nav-form").addEventListener("click", function() {
        buildForm(config, clearContentContainer());
    });
    parentElement.querySelector("a#nav-search").addEventListener("click", function() {
        const content = clearContentContainer();
        console.log("search clicked");
        // TODO implement
    });
    
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

    buildNavigation(config, document.body);
    buildContentContainer(config, document.body);

}

runMe().then(function() {
    // load home page
    document.querySelector("a#nav-home").click();
})
