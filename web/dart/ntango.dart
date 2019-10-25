/*
 * NetTango
 * Copyright (c) 2017 Michael S. Horn, Uri Wilensky, and Corey Brady
 *
 * Northwestern University
 * 2120 Campus Drive
 * Evanston, IL 60613
 * http://tidal.northwestern.edu
 * http://ccl.northwestern.edu

 * This project was funded in part by the National Science Foundation.
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */
library NetTango;

import 'dart:math';
import 'dart:html';
import 'dart:convert';
import 'dart:web_audio';
import 'dart:js' as js;

part 'versions/version-utils.dart';
part 'versions/version-1.dart';
part 'versions/version-2.dart';
part 'versions/version-manager.dart';

part 'utils/matrix.dart';
//part 'utils/sounds.dart';
part 'utils/touch.dart';
part 'utils/utils.dart';

part 'blocks/block.dart';
part 'blocks/expression.dart';
part 'blocks/control.dart';
part 'blocks/formatter.dart';
part 'blocks/menu.dart';
part 'blocks/parameter.dart';
part 'blocks/program-changed-event.dart';
part 'blocks/workspace.dart';


var _workspaces = { };


void _init(String canvasId, Map json) {
  VersionManager.updateWorkspace(json);
  _workspaces[canvasId] = new CodeWorkspace(canvasId, json);
  _workspaces[canvasId].draw();
}

/// Javascript hook to initialize a workspace
void JSInitWorkspace(String canvasId, String jsonString) {
  if (_workspaces[canvasId] is CodeWorkspace) {
    _workspaces[canvasId].unload();
  }
  var json = jsonDecode(jsonString);
  if (json is Map) {
    _init(canvasId, json);
  }
}

/// Javascript hook to initialize all workspaces based on canvasID names
void JSInitAllWorkspaces(String jsonString) {
  var json = jsonDecode(jsonString);
  if (json is Map) {
    for (var key in json.keys) {
      if (_workspaces[key] is CodeWorkspace) {
        _workspaces[key].unload();
      }
      if (json[key] is Map) {
        _init(key, json[key]);
      }
    }
  }
}


/// Javascript hook to export code from a workspace
String JSExportCode(String canvasId, String language) {
  if (_workspaces.containsKey(canvasId)) {
    return CodeFormatter.formatCode(language, canvasId, _workspaces[canvasId].exportParseTree());
  }
  return null;
}


/// Javascript hook to export the entire state of a workspace
String JSSaveWorkspace(String canvasId) {
  if (_workspaces.containsKey(canvasId)) {
    var defs = _workspaces[canvasId].definition;
    defs['program'] = _workspaces[canvasId].exportParseTree();
    return jsonEncode(defs);
  }
}


/// Javascript hook to export all workspaces
String JSSaveAllWorkspaces() {
  var json = { };
  for (var key in _workspaces.keys) {
    var defs = _workspaces[key].definition;
    defs['program'] = _workspaces[key].exportParseTree();
    json[key] = defs;
  }
  return jsonEncode(json);
}


/// Expose core API functions to Javascript
void main() {
  js.context['NetTango_InitWorkspace'] = JSInitWorkspace;
  js.context['NetTango_InitAllWorkspaces'] = JSInitAllWorkspaces;
  js.context['NetTango_ExportCode'] = JSExportCode;
  js.context['NetTango_Save'] = JSSaveWorkspace;
  js.context['NetTango_SaveAll'] = JSSaveAllWorkspaces;
}
