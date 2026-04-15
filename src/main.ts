import "@swc-uxp-internal/icons-workflow/icons/sp-icon-add-circle"
import "@components/su-table"
import "@components/su-table-row"
import "@components/su-table-cell"
import "@components/file-select"

// styles
import "@components/su-theme"

import { settings } from "@core/settings-store";
import { captionStore } from "@core/caption-store"
import { ppro, ufs } from "@core/api";
import type { storage } from "uxp";
import type { SuTable } from "@components/su-table";

const loadCaptionFileHandler = async () => {
  const file = await ufs.getEntryWithUrl(settings.get().captionFile);
  await captionStore.init(file as storage.File);
  const table = document.querySelector("su-table") as SuTable;
  table.loadCaptions();
}

(async () => {
  const project = await ppro.Project.getActiveProject();
  // remove long path prefix '\\?\'
  const projectPath = project.path.slice(4);
  const projectDirectory = window.path.dirname(projectPath);

  settings.subscribe((settings) => {
    if (settings.captionFile !== "undefined") {
      loadCaptionFileHandler();
    }
  });

  // There is a chance that initSettings() is run before all
  // connectedCallbacks() are called. This is undesirable because the
  // custom components subscribe to changes in the SettingsStore (which is
  // updated via initSettings()) to update their contents.

  // This is a bandaid fix to make sure all connectedCallbacks() are done
  // (read: all subscribers are done subscribing) before initSettings() is
  // called.

  // TODO: A more elegant solution would be to have all connectedCallbacks()
  // fire some sort of ready signal and only allow initSettings() to run after
  // all ready signals have been collected.
  await new Promise(resolve => setTimeout(resolve, 100)); // wait 1 second

  settings.initSettings(`${projectDirectory}/settings.su`);
})();
