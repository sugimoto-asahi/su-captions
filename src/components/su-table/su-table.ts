import { SuElement } from "@core/su-element";
import type { SuTableRow } from "@components/su-table-row";
import styles from "./su-table.css?inline";

import { captionStore } from "@core/caption-store"
import type { CaptionFile } from "@core/caption-file"
import type { Caption } from "@core/caption"
import type { SuTableCell } from "@components/su-table-cell";

export class SuTable extends SuElement(styles) {
  #widths!: number[];
  override connectedCallback(): void {
    super.connectedCallback();
  }

  override template(): string {
    return `
    <su-table-row>
      <su-table-cell>Id</su-table-cell>
      <su-table-cell>Timecode Start</su-table-cell>
      <su-table-cell>Timecode End</su-table-cell>
      <su-table-cell>Caption</su-table-cell>
    </su-table-row>
    <slot></slot>
    `;
  }
  override then(): void {
  }

  loadCaptions(): void {
    const captions: CaptionFile = captionStore.captionFile;
    const tracks = captions.getTrackNames();
    const miko = captions.getTrack("Miko");
    const miko_captions = miko.captions;
    miko_captions.forEach((caption) => {
      const row = this.createRow(caption);
      this.appendChild(row);
    });
  }

  createRow(caption: Caption): SuTableRow {
    const row = document.createElement('su-table-row') as SuTableRow;
    const id = document.createElement('su-table-cell') as SuTableCell;
    const startTimecode = document.createElement('su-table-cell') as SuTableCell;
    const endTimecode = document.createElement('su-table-cell') as SuTableCell;
    const captionContent = document.createElement('su-table-cell') as SuTableCell;

    id.textContent = "1";
    startTimecode.textContent = caption.startTimecode.toString();
    endTimecode.textContent = caption.endTimecode.toString();
    captionContent.textContent = caption.content;

    row.appendChild(id);
    row.appendChild(startTimecode);
    row.appendChild(endTimecode);
    row.appendChild(captionContent);

    this.appendChild(row);
    row.setWidths([100, 100, 100, 100])
    return row;
  }
}

customElements.define('su-table', SuTable);
