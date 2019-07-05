# Sample Client-Only Interface

HTML and JavaScript and JSON, no servers.

Tested with Firefox.

## Project Structure

- index.html : User Interface (starting point). Hosts minimal content; loads content from "src" directory
- src/client.js : sample interface-building code. Drives _how_ the interface is built (what a field is)
- src/config.json : sample configuration file. Drives _content_ for the interface (which fields)
- src/data.json : sample data holdings; demonstrating pseudo-database
- src/w3.css : base CSS, provided by W3 (ref: https://www.w3schools.com/w3css/w3css_downloads.asp). No license is necessary. Version 4.13 (June 2019)
- src/style.css : custom CSS styling

## Config

App.Features
- The 'id' values should not be modified. These are how the code responds to the actions. 
- The 'name' values can be whatever is desired.
- The order of navigation can be modified by changing the order in config.