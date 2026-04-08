import "@swc-uxp-internal/icons-workflow/icons/sp-icon-add-circle"
import "@components/su-table"

// styles
import "@swc-uxp-internal/theme/sp-theme.js"
import "@swc-uxp-internal/theme/theme-dark.js"
import "@swc-uxp-internal/theme/scale-medium.js"


import { storage, entrypoints } from "uxp"

import type { premierepro } from "@localTypes/premierepro";
const ppro = require("premierepro") as premierepro;

const fs = storage.localFileSystem;
  const project = await ppro.Project.getActiveProject();
  if (!project) {
    log("There is no active project found", "red");
  } else {
    log(`Active project: ${project.name}`);
    // Get the active sequence.
    const sequence = await project.getActiveSequence();
    const time = await sequence.getInPoint();
    log("In point is " + time.seconds);
    if (!sequence) {
      log("There is no active sequence found", "red");
    } else {
      log(`Active sequence: ${sequence.name}`);
    }
  }
}

// Log function to display messages in the plugin body.
function log(msg: string | number, color?: string) {
  document.getElementById("plugin-body")!.innerHTML += color
    ? `<span style='color:${color}'>${msg}</span><br />`
    : `${msg}<br />`;
}
