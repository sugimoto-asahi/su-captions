import "@swc-uxp-internal/icons-workflow/icons/sp-icon-add-circle"
import "@components/su-table"
import "@components/su-table-row"
import "@components/su-table-cell"

// styles
import "@swc-uxp-internal/theme/sp-theme.js"
import "@swc-uxp-internal/theme/theme-dark.js"
import "@swc-uxp-internal/theme/scale-medium.js"


import { storage, entrypoints } from "uxp"

import type { premierepro } from "@localTypes/premierepro";
const ppro = require("premierepro") as premierepro;

const fs = storage.localFileSystem;

const loadCaptionFileHandler = async (e: Event) => {
  const project = await ppro.Project.getActiveProject();
  // open the caption file picker at the project directory
  // const projectFile = await fs.getEntryWithUrl("C:/Users/juayh/Dev/su-captions/");

  // remove long path prefix '\\?\'
  const projectPath = project.path.slice(4);
  const projectDirectory = window.path.dirname(projectPath);
  console.log(projectPath);
  console.log(projectDirectory);

  const projectFolder = await fs.getEntryWithUrl(projectDirectory);
  // open the caption file picker at the project directory
  const options = {
    types: [
      "su"
    ],
    initialLocation: projectFolder,
    allowMultiple: false
  }
  try {
    const captionFile = await fs.getFileForOpening(options);
  }
  catch (error) {
    console.log(error);
  }
};

entrypoints.setup({
  commands: {
    // @ts-ignore
    loadCaptionFile: loadCaptionFileHandler
  }
})
