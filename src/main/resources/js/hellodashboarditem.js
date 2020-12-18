/** Key in preferences object for the value of the HTML input. */
const exampleInputKey = "exampleInput";

/** Default values to use in preferences object. */
const defaultValues = {
  [exampleInputKey]: "Default value",
};

// Can use different default values when running locally:
if (window.origin.includes("localhost")) {
  defaultValues[exampleInputKey] = "Default value in local dev";
}

/** All HTML inputs that are stored to preferences. */
const userPrefsKeys = [exampleInputKey];

/** Get the HTML for a text input of the form. */
const getFieldGroupHtml = (prefsKey, label) => `
  <div class="field-group">
    <label for="${prefsKey}">
      ${label}
      <span class="aui-icon icon-required">(required)</span>
    </label>
    <input class="text full-width-field" type="text" name="${prefsKey}">
  </div>
`;

/** Static HTML for the preferences screen. */
const configHtml = `
  <form class="aui" onsubmit="return false">
    ${getFieldGroupHtml(exampleInputKey, "Example input")}
    <!-- Any other inputs go here -->
    <div class="field-group">
      <div class="full-width-field">
        A helpful message can go here
      </div>
    </div>
    <div class="buttons-container">
      <div class="buttons">
        <button class="aui-button aui-button-primary save">Save</button>
        <button class="aui-button defaults">Apply Defaults</button>
        <button class="aui-button cancel">Cancel</button>
      </div>
    </div>
  </form>
`;

/** Static HTML for the main screen. */
const appHtml = `
  <p>Hello world!</p>
  <p></p>
`;

/** Define the AMD module that Jira will use to create the dashboard item in the browser. */
define("starterdashboarditems/hellodashboarditem", [
  // Must match <amd-module> in atlassian-plugin.xml
  "underscore",
  "jquery",
  "wrm/context-path",
], (_, $, contextPath) => {
  class HelloDashboardItem {
    constructor(API) {
      this.API = API;
      this.preferences = {}; // Set by render and renderEdit
      this.searchUrl = `${contextPath()}/rest/api/2/search`; // contextPath is URL to Jira instance.
    }

    /**
     * Remove unwanted HTML encodings from preferences
     *
     * @param {*} prefs The preferences object from Jira API.
     */
    normalizePreferences(prefs = {}) {
      for (let key of userPrefsKeys) {
        const value = prefs[key];
        if (_.isString(value)) {
          prefs[key] = $("<div/>").html(value).text(); // Decode any HTML encodings
        } else if (_.isUndefined(value) || _.isNull(value)) {
          prefs[key] = defaultValues[key]; // Use default value if key not defined in preferences
        }
      }
      return prefs;
    }

    /**
     * Render the view for the dashboard item configured by renderEdit.
     *
     * @param context The <div> that the dashboard item should render inside of.
     * @param preferences The user preferences saved for this dashboard item (e.g. filter id, number of results...)
     */
    async render(context, preferences) {
      // Remove unwanted HTML encoding from preferences:
      this.preferences = this.normalizePreferences(preferences);

      // Prevent screen flicker caused by saving preferences in the main screen (not the config screen):
      if (this.preventRerender) {
        this.preventRerender = false;
        return;
      }

      // Hide container div and show loading bar while adding dynamic content:
      this.$div = $(context);
      this.$div.hide();
      this.API.showLoadingBar();
      await this.$div.empty().html(appHtml).promise();

      // Add or modify any dynamic content:
      $("p:last-child", this.$div).text(preferences[exampleInputKey]);

      // Hide loading bar, show content, and resize the container div to fit the content:
      await this.$div.show().promise();
      this.API.hideLoadingBar();
      this.API.resize();
    }

    /**
     * Render the view for the edit page of the dashboard item.
     *
     * @param context The <div> that the dashboard item should render inside of.
     * @param preferences The user preferences saved for this dashboard item (e.g. filter id, number of results...)
     */
    async renderEdit(context, preferences) {
      this.API.hideLoadingBar();

      // Remove unwanted HTML encoding from preferences:
      this.preferences = this.normalizePreferences(preferences);

      // Don't show edit screen if the user can't edit the preferences anyway:
      if (!this.API.isEditable()) {
        console.warn(`Dashboard item is not editable. Check your permissions.`);
        this.API.closeEdit();
        return;
      }

      // Put render screen on page:
      this.$div = $(context);
      await this.$div.empty().html(configHtml).promise();
      this.API.resize();

      // Set initial form value:
      const $form = $("form", this.$div);
      for (let key of userPrefsKeys) {
        const $input = $(`input[name=${key}]`, $form);
        $input.val(preferences[key]);
      }

      // Add click handlers to the buttons:
      const $save = $("button.save", $form);
      const $cancel = $("button.cancel", $form);
      const $defaults = $("button.defaults", $form);
      $cancel.click(() => this.API.closeEdit());
      $defaults.click(() => {
        for (let key of Object.keys(defaultValues)) {
          const $input = $(`input[name=${key}]`, $form);
          $input.val(defaultValues[key]);
        }
      });
      $save.click(async (event) => {
        event.preventDefault(); // Needed if button's type is submit
        const newPrefs = $form
          .serializeArray()
          .reduce((p, c) => ({ ...p, [c.name]: c.value }), {});
        this.API.showLoadingBar();
        await this.API.savePreferences({ ...preferences, ...newPrefs });
        this.API.hideLoadingBar();
      });
    }
  }

  return HelloDashboardItem;
});
