import "@swc-uxp-internal/icons-workflow/icons/sp-icon-add-circle"
import "@components/su-table"
import "@components/su-table-row"
import "@components/su-table-cell"
import "@components/file-select"

// styles
import "@components/su-theme"

import { settings, loadSettings } from "@core/settings";
import { captionStore } from "@core/caption-store"
import { ufs } from "@core/api";
import type { storage } from "uxp";
import type { SuTable } from "@components/su-table";

const loadCaptionFileHandler = async () => {
  const file = await ufs.getEntryWithUrl(settings.getCaptionFilepath());
  await captionStore.init(file as storage.File);
  const table = document.querySelector("su-table") as SuTable;
  table.loadCaptions();
}

(async () => {
  await loadSettings();

  // If the settings file already has the captions filepath set,
  // we can start loading the captions into SuTable immediately.
  if (settings.isCaptionsFileSpecified()) {
    loadCaptionFileHandler();
  }
})();

document.addEventListener("load-caption-file", loadCaptionFileHandler);

