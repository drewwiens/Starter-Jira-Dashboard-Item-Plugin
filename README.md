# Starter Jira Dashboard Item Plugin

Blank starter project for a dynamic jQuery dashboard item Jira plugin.

This is the **minimum code** to build a plugin for a dynamic frontend dashboard item that has an edit screen.

Tip: You can use Find and Replace in your editor in the root dir to rename the project's package name, organization, dashboard item name, etc. Make sure to rename `starterdashboarditems.properties` and `hellodashboarditem.js` too.

## Usage

- `atlas-run` -- Installs this plugin into the product and starts it on http://localhost:2990/jira
  - The instance will automatically include the plugin and db from this repo.
  - Local dev login username and password is "admin"
- `atlas-debug` -- Same as atlas-run, but allows a debugger to attach at port 5005
- `atlas-help` -- Prints description for all commands in the SDK
- `atlas-package` -- Run any time you need to re-package the plugin, e.g. after breaking changes.
  - Changes in existing **frontend** JS and CSS files just need a page refresh in the browser and don't require re-packaging.

## File structure

- [./src/main/java](./src/main/java) -- Backend (server-side) Java code, if any.
  - Not always needed since pure frontend dashboard items are possible, and often practical.
- [./src/main/resources](./src/main/resources) -- Contains all frontend (client-side) source files.
- [./src/main/resources/atlassian-plugin.xml](./src/main/resources/atlassian-plugin.xml) -- Defines the Jira plugin, the paths to the source files, and the sample "hello" dashboard item.
  - You can provide more than one dashboard item in "atlassian-plugin.xml" if you want!
  - Must list each JavaScript and CSS file individually because the packager uses those entries to minify each file, include the stylesheets on the page, and detect AMD modules you define in the JavaScript files.
- [./src/main/resources/dashboarditems.properties](./src/main/resources/dashboarditems.properties) -- Defines the Jira plugin and the sample "hello" dashboard item.
- [./src/test/java](./src/test/java) -- Backend (server-side) Java unit testing code, if any.
- [./src/test/resources](./src/test/resources) -- Files needed for local development and testing.
- [./pom.xml](./pom.xml) -- Defines the overall project, its metadata, the local dev Jira version, and any external dependencies.
- [./.vscode](./.vscode) -- Visual Studio Code editor's local settings for this project.

## Troubleshooting

### Dashboard item does not appear in "Add Gadget" screen

If the gadget does not appear in the "Add Gadget" screen in any Jira dashboard, check the console output. Usually a dashboard item is missing from the Add Gadget screen because the plugin failed to load. When that happens, the reason is printed to the console. It's easy to miss because Jira prints a lot of things to the console.

## Resources

- [Dashboard items docs](https://developer.atlassian.com/server/jira/platform/dashboard-item-module/)
- ["Writing a dashboard item app" tutorial](https://developer.atlassian.com/server/jira/platform/writing-a-dashboard-item-app/) -- Useful for understanding XML, JavaScript API, and file structure for dashboard items.
- [Atlassian AUI docs](https://aui.atlassian.com/) -- The UI component library to use with jQuery.
- [Atlassian Plugin SDK docs](https://developer.atlassian.com/display/DOCS/Introduction+to+the+Atlassian+Plugin+SDK)
- [Atlaskit docs](https://atlaskit.atlassian.com) -- The React UI component library. Useful if you switch the project from jQuery to React.
