// NetTango Copyright (C) Michael S. Horn, Uri Wilensky, and Corey Brady. https://github.com/NetTango/NetTango

/**
 * NetTango functions can be used to create a blocks-based programming interface
 * associated with an HTML canvas.
 */
var NetTango = {

  blockPlacementOptions: NetTango_blockPlacementOptions,
  selectQuoteOptions: NetTango_selectQuoteOptions,

  /// Call init to instantiate a workspace associated with an HTML canvas.
  /// TODO: Document JSON specification format--for now see README.md
  init: function(language, canvasId, json, formatAttributeJS) {
    NetTango_InitWorkspace(language, canvasId, JSON.stringify(json), formatAttributeJS);
  },

  /// Add a callback function to receive programChanged events from the
  /// workspace. Callback functions should take one parameter, which is
  /// the canvasId for the workspace (as a String).
  onProgramChanged: function(canvasId, callback) {
    NetTango._callbacks[canvasId] = callback;
  },

  /// Exports the code for a workspace in a given target language.
  /// The only language supported now is "NetLogo".
  exportCode: function(canvasId, formatAttributeJS) {
    return NetTango_ExportCode(canvasId, formatAttributeJS);
  },

  formatAttributeValue: function(canvasId, instanceId, attributeId) {
    return NetTango_FormatAttributeValue(canvasId, instanceId, attributeId);
  },

  /// Exports the current state of the workspace as a JSON object to be
  /// restored at a later point.
  save: function(canvasId) {
    return JSON.parse(NetTango_Save(canvasId));
  },

  /// Exports the state of all workspaces as a JSON object to be restored
  /// at a later point.
  saveAll: function() {
    return JSON.parse(NetTango_SaveAll());
  },

  /// Restores a workspace to a previously saved state (json object).
  /// Note, for now this is just an alias of the NetTango.init function.
  restore: function(language, canvasId, json, formatAttribute) {
    NetTango_InitWorkspace(language, canvasId, JSON.stringify(json), formatAttribute);
  },

  /// Restores all workspaces from a previously saved state.
  restoreAll: function(language, json, formatAttribute) {
    NetTango_InitAllWorkspaces(language, JSON.stringify(json), formatAttribute);
  },

  _relayCallback: function(canvasId, event) {
    if (canvasId in NetTango._callbacks) {
      NetTango._callbacks[canvasId](canvasId, event);
    }
  },

  _callbacks : { }
}
