import { SuElement } from "@core/su-element";
import styles from "./file-select.css?inline";

import { storage } from "uxp";

import { settings } from "@core/settings-store";
import { ppro, ufs } from "@core/api";


class FileSelect extends SuElement(styles) {
  #filePath: string;

  constructor() {
    super();
    this.#filePath = "No caption file set";
  }

  override template(): string {
    return `
    <div class="select">File...</div>
    <div class='filepath'>${this.#filePath}</div>
    <slot></slot>
    `;
  }

  override then(): void {
    const selectButton = this.shadowRoot?.querySelector(".select");
    const filePathDisplay = this.shadowRoot?.querySelector(".filepath");

    selectButton!.addEventListener('click', this.#clickHandler);
    settings.subscribe((state) => {
      filePathDisplay!.textContent = state.captionFile;
    });
  }

  async #clickHandler() {
    const project = await ppro.Project.getActiveProject();
    // open the caption file picker at the project directory

    // remove long path prefix '\\?\'
    const projectPath = project.path.slice(4);
    const projectDirectory = window.path.dirname(projectPath);

    const projectFolder = await ufs.getEntryWithUrl(projectDirectory);
    // open the caption file picker at the project directory
    const options = {
      types: ["su"],
      initialLocation: projectFolder,
      allowMultiple: false
    }
    try {
      const captionFile: storage.File = await ufs.getFileForOpening(options);
      settings.setCaptionFilepath((captionFile as Entry).nativePath);
    }
    catch (error) {
      console.error(error);
    }
  }
}

customElements.define('file-select', FileSelect);
