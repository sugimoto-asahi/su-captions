import { SuElement } from "@core/su-element";
import type { SuTableRow } from "@components/su-table-row";
import "@components/track-select"

import "@components/su-divider"
import type { SuDivider } from "@components/su-divider";

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
  // internal list of all caption rows
  private rows: SuTableRow[] = [];
  private headerRow!: SuTableRow;

  // container for all caption rows
  private captionRows!: HTMLDivElement;

  override template(): string {
    return `
    <track-select></track-select>
    <su-table-row class="header">
      <su-table-cell>Id</su-table-cell>
      <su-table-cell>Timecode Start</su-table-cell>
      <su-table-cell>Timecode End</su-table-cell>
      <su-table-cell>Caption</su-table-cell>
    </su-table-row>
    <div class="caption-rows">
      <slot></slot>
    </div>
    `;
  }
  override then(): void {
    this.headerRow = this.shadowRoot!.querySelector("su-table-row.header") as SuTableRow;
    this.captionRows = this.shadowRoot!.querySelector(".caption-rows") as HTMLDivElement;


    const divider = document.createElement("su-divider") as SuDivider;
    divider.setAttribute("orientation", "vertical");
    divider.setAttribute("offset", "100");
    divider.setAttribute("thickness", "5");
    divider.setAttribute("color", "white");
    this.captionRows.appendChild(divider);

    // hide the header row if there is no currently selected caption track
    this.hideHeader();

    // Load the CaptionFile's contents
    captionStore.subscribe((store) => {
      // save the parsed CaptionFile object locally -
      // we will never read from the store again unless a new caption file is loaded
      if (store.captionFile) {
        this.captionFile = store.captionFile;
        this.loadCaptions(store.captionFile);

      }
    });

    // Link the width store up with all rows
    widthStore.subscribe((store) => {
      this.headerRow.setWidths(store.widths);
      this.rows.forEach((row) => {
        row.setWidths(store.widths);
      })
    });

    // Listen in on track select events
    // Currently these come from a track selector child component
    // of SuTable. TODO: decouple TrackSelect from SuTable,
    // and propagate TrackSelectEvents via the event bus instead
    // of enforcing this arbitrary parent-child relationship between
    // SuTable and TrackSelect
    this.addEventListener(TrackSelectEvent.type, (event) => {
      const e = event as TrackSelectEvent;
      e.stopPropagation();
      this.showHeader();
      this.loadTrack(e.detail.trackName);
      widthStore.set({
        widths: [100, 100, 100, 100]
      });
    })

    // Listen in on caption change events
    // These come from control buttons in SuControls
    controlEventBus.subscribe("add-caption", () => {
      this.handleAddCaption();
    });
    controlEventBus.subscribe("remove-caption", () => {
      this.handleRemoveCaption();
    });
  }

  // Show the header row
  private showHeader(): void {
    this.headerRow.style.display = "flex";
  }

  // Hide the header row
  private hideHeader(): void {
    this.headerRow.style.display = "none";
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
   * Ingest a new CaptionFile object into the table
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
