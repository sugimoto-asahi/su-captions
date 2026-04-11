import { SuElement } from "@core/su-element";
import styles from "./file-select.css?inline";

import { storage } from "uxp";

import { settings } from "@core/settings";
import { ppro, ufs } from "@core/api";


class FileSelect extends SuElement(styles) {

  override template(): string {

    const shouldShowCaptionFilepath = true;

    const filePath_TEMP = "/temp/path";

    return `
    ${shouldShowCaptionFilepath ? `<div class='filepath'>${filePath_TEMP}</div>` : ""}
    <div class="select">File...</div>
    <slot></slot>
    `;
  }

  override then(): void {

  }
}

customElements.define('file-select', FileSelect);
