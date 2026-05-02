import { SuElement } from "@core/su-element";
import type { SuTableRow } from "@components/su-table-row";
import { RowContentChangedEvent } from "@components/su-table-row";
import "@components/track-select";

import "@components/su-divider";
import { DividerMoveEvent, type SuDivider } from "@components/su-divider";

import styles from "./su-table.css?inline";

import { captionStore } from "@core/caption-store";
import type { CaptionFile } from "@core/caption-file";
import type { Caption } from "@core/caption";
import type { SuTableCell } from "@components/su-table-cell";
import { trackListStore } from "@core/track-list-store";
import { TrackSelectEvent } from "@components/menu-item";
import { controlEventBus } from "@core/control-event-bus";
import { ColumnEngine } from "@core/column-engine";

interface Column {
  currentWidth: number;
  divider: SuDivider | null;
  cells: SuTableCell[];
}

export class SuTable extends SuElement(styles) {
  private captionFile!: CaptionFile;

  // container for all caption rows
  private captionRows!: HTMLDivElement;
  // internal list of all caption rows
  private rows: SuTableRow[] = [];

  private headerRow!: SuTableRow;
  private headerNames: string[] = [];
  private columnMap = new Map<string, Column>();

  private columnEngine!: ColumnEngine;

  override template(): string {
    return `
    <track-select></track-select>
    <slot name="header"></slot>
    <div class="caption-rows">
        <slot></slot>
    </div>
    `;
  }
  override then(): void {
    this.captionRows = this.shadowRoot!.querySelector(
      ".caption-rows",
    ) as HTMLDivElement;

    const headerSlot = this.shadowRoot!.querySelector(
      'slot[name="header"]',
    ) as HTMLSlotElement;

    headerSlot.addEventListener("slotchange", () => {
      this.headerRow = headerSlot.assignedElements()[0] as SuTableRow;

      // note down all the header names
      const headerCells = this.headerRow.getCells();
      headerCells.forEach((cell) => {
        const name = cell.getAttribute("id")!;
        this.headerNames.push(name);
        cell.setName(name);
      });

      // initialize entries in column map
      this.headerNames.forEach((id) => {
        this.columnMap.set(id, { currentWidth: 0, divider: null, cells: [] });
      });

      // add the header cells themselves to the map
      headerCells.forEach((cell) => {
        const column = this.columnMap.get(cell.getName())!;
        column.cells.push(cell);
      });

      // we dont know the width of the table yet so we use 1 for now
      this.columnEngine = new ColumnEngine(this.headerNames, 1);

      this.makeVerticalDividers();

      // hide the header row if there is no currently selected caption track
      this.hideHeader();
    });

    // Load the CaptionFile's contents
    captionStore.subscribe((store) => {
      // save the parsed CaptionFile object locally -
      // we will never read from the store again unless a new caption file is loaded
      if (store.captionFile) {
        this.captionFile = store.captionFile;
        this.loadCaptions(store.captionFile);
      }
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

      // // set initial widths
      // widthStore.set({
      //   widths: [100, 100, 100, 100],
      // });
    });

    this.addEventListener(DividerMoveEvent.type, (event) => {
      const e = event as DividerMoveEvent;
      event.stopPropagation();

      // calculate new widths
      this.columnEngine.resizeDelta(e.detail.name, e.detail.delta);

      this.headerNames.forEach((name) => {
        const column = this.columnMap.get(name)!;
        // update cells
        column.cells.forEach((cell) => {
          const width = this.columnEngine.getWidth(cell.getName())!;
          cell.setWidth(width);
        });
      });
    });

    this.addEventListener(RowContentChangedEvent.type, (event) => {
      const e = event as RowContentChangedEvent;
      e.stopPropagation();
      console.log(
        "id:",
        e.detail.id,
        "cellType:",
        e.detail.cellType,
        "content:",
        e.detail.content,
      );
    });

    // Listen in on caption change events
    // These come from control buttons in SuControls
    controlEventBus.subscribe("add-caption", () => {
      this.handleAddCaption();
    });
    controlEventBus.subscribe("remove-caption", () => {
      this.handleRemoveCaption();
    });

    // when the size of the captionRows container changes,
    // recalculate the positions of each divider/ the widths of each column
    const captionRowsWidthObserver = new ResizeObserver((entry) => {
      const width = entry[0].contentBoxSize[0].inlineSize;
      this.columnEngine.updateMaxWidth(width);

      let position = 0; // position of divider
      this.headerNames.forEach((headerName) => {
        // width of this column
        const width = this.columnEngine.getWidth(headerName)!;
        position += width;
        const column = this.columnMap.get(headerName)!;
        // update dividers
        column.divider?.setPosition(position);

        // update cells
        column.cells.forEach((cell) => {
          cell.setWidth(width);
        });
      });
    });
    captionRowsWidthObserver.observe(this.captionRows);
  }

  /**
   * Create the set of vertical dividers for this table at the appropriate
   * positions. This is based on the number of columns in the table.
   * There is one vertical divider per column,
   * and the vertical divider acts as the right bound of the column.
   * Each vertical divider is identified by the column it bounds.
   */
  private makeVerticalDividers(): void {
    // one vertical divider for each column (except the last, which is
    // bound by the edge of the table instead
    for (const id of this.headerNames.slice(0, -1)) {
      const divider = document.createElement("su-divider") as SuDivider;
      divider.init(id);
      divider.setAttribute("orientation", "vertical");
      divider.setAttribute("offset", "0");
      divider.setAttribute("thickness", "5");
      divider.setAttribute("color", "white");
      this.captionRows.appendChild(divider);
      this.columnMap.get(id)!.divider = divider;
    }
  }

  // Show the header row
  private showHeader(): void {
    this.headerRow.style.display = "flex";
  }

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

      const cells = row.getCells();
      cells.forEach((cell) => {
        const entry = this.columnMap.get(cell.getName());
        entry?.cells.push(cell);
      });
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
    const row = document.createElement("su-table-row") as SuTableRow;
    const index = document.createElement("su-table-cell") as SuTableCell;
    const startTimecode = document.createElement(
      "su-table-cell",
    ) as SuTableCell;
    const endTimecode = document.createElement("su-table-cell") as SuTableCell;
    const captionContent = document.createElement(
      "su-table-cell",
    ) as SuTableCell;

    index.setName(this.headerNames.at(0)!);
    startTimecode.setName(this.headerNames.at(1)!);
    endTimecode.setName(this.headerNames.at(2)!);
    captionContent.setName(this.headerNames.at(3)!);

    index.setType("area");
    startTimecode.setType("area");
    endTimecode.setType("area");
    captionContent.setType("area");

    startTimecode.setCellType("startTimecode");
    endTimecode.setCellType("endTimecode");
    captionContent.setCellType("content");

    index.setText("1");
    startTimecode.setText(caption.startTimecode.toString());
    endTimecode.setText(caption.endTimecode.toString());
    captionContent.setText(caption.content);

    row.setCaptionId(caption.id);
    row.appendChild(index);
    row.appendChild(startTimecode);
    row.appendChild(endTimecode);
    row.appendChild(captionContent);

    this.appendChild(row);
    return row;
  }
}

customElements.define("su-table", SuTable);
