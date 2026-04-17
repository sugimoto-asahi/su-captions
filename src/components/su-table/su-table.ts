import { SuElement } from "@core/su-element";
import type { SuTableRow } from "@components/su-table-row";
import "@components/track-select"

import styles from "./su-table.css?inline";

import { captionStore } from "@core/caption-store"
import type { CaptionFile } from "@core/caption-file"
import type { Caption } from "@core/caption"
import type { SuTableCell } from "@components/su-table-cell";
import { widthStore } from "@core/width-store"
import { trackListStore } from "@core/track-list-store"
import { TrackSelectEvent } from "@components/menu-item";
import { controlEventBus } from "@core/control-event-bus";



export class SuTable extends SuElement(styles) {
  private captionFile!: CaptionFile;
  private rows: SuTableRow[] = [];
  private headerRow!: SuTableRow;

  override template(): string {
    return `
    <track-select></track-select>
    <su-table-row class="header">
      <su-table-cell>Id</su-table-cell>
      <su-table-cell>Timecode Start</su-table-cell>
      <su-table-cell>Timecode End</su-table-cell>
      <su-table-cell>Caption</su-table-cell>
    </su-table-row>
    <slot></slot>
    `;
  }
  override then(): void {
    this.headerRow = this.shadowRoot!.querySelector("su-table-row.header") as SuTableRow;

    // Load the CaptionFile's contents
    captionStore.subscribe((store) => {
      // save the parsed CaptionFile object locally -
      // we will never read from the store again unless a new caption file is loaded
      if (store.captionFile) {
        this.captionFile = store.captionFile;
        this.loadCaptions(store.captionFile);
      }
    });

    // Update widths of all rows in the table
    widthStore.subscribe((store) => {
      this.headerRow.setWidths(store.widths);
      this.rows.forEach((row) => {
        row.setWidths(store.widths);
      })
    });

    this.addEventListener(TrackSelectEvent.type, (event) => {
      const e = event as TrackSelectEvent;
      e.stopPropagation();
      this.loadTrack(e.detail.trackName);
      widthStore.set({
        widths: [100, 100, 100, 100]
      });
    })

    // Subscribe to control actions fired from sibling <su-controls> via the bus
    controlEventBus.subscribe("add-caption", () => {
      this.handleAddCaption();
    });
    controlEventBus.subscribe("remove-caption", () => {
      this.handleRemoveCaption();
    });
  }

  private handleAddCaption(): void {
    //TODO
    console.log("add-caption");
  }

  private handleRemoveCaption(): void {
    //TODO
    console.log("remove-caption");
  }

  private loadTrack(trackName: string): void {
    const track = this.captionFile.getTrack(trackName);
    // Clear the currently rendered rows

    // Remove from dom
    this.rows.forEach((row) => {
      row.remove();
    });
    // Remove from row list
    this.rows = [];

    // Add new rows
    track.captions.forEach((caption) => {
      const row = this.createRow(caption);
      this.appendChild(row);
      this.rows.push(row);
    });
  }

  /**
   * Ingest a new CaptionFile object into the t
   * @param captions Object to ingest
   */
  private loadCaptions(captions: CaptionFile): void {
    const tracks = captions.getTrackNames();
    trackListStore.set({ tracks });
  }

  private createRow(caption: Caption): SuTableRow {
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
