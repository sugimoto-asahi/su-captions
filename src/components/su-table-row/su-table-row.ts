import { SuElement } from "@core/su-element";
import {
  CellContentChangedEvent,
  SuTableCell,
  type CellType,
} from "@components/su-table-cell";
import styles from "./su-table-row.css?inline";

export interface RowContentChangedDetail {
  id: string;
  cellType: CellType;
  content: string;
}

export class RowContentChangedEvent extends CustomEvent<RowContentChangedDetail> {
  static readonly type = "row-content-changed" as const;

  constructor(detail: RowContentChangedDetail) {
    super(RowContentChangedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * A single table row, contains a number of SuTableCells
 * Each table row has a number of slots, which each slot representing
 * an element in the table row.
 *
 * This is not to be confused with the <slot> element.
 *
 * SuTableRow does not control the spacing between each element.
 *
 * The reason for this is that when column resizing is performed,
 * the parent SuTable component will calculate the new column widths
 * and propagate this information to all SuTableRows instead.
 *
 * This way, each SuTableRow can maintain the exact same spacing between
 * each element.
 */
export class SuTableRow extends SuElement(styles) {
  private cells!: SuTableCell[];
  private captionId!: number;

  setCaptionId(id: number) {
    this.captionId = id;
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override template(): string {
    return `
    <slot></slot>
    `;
  }

  override then(): void {
    this.cells = [
      ...(this.querySelectorAll("su-table-cell") as NodeListOf<SuTableCell>),
    ];

    this.addEventListener(CellContentChangedEvent.type, (event) => {
      const e = event as CellContentChangedEvent;
      e.stopPropagation();
      this.dispatchEvent(
        new RowContentChangedEvent({
          id: this.captionId,
          cellType: e.detail.cellType,
          content: e.detail.content,
        }),
      );
    });
  }

  /**
   * Get a copy of the SuTableCell elements in this row
   * @returns Array of SuTableCell elements
   */
  getCells(): SuTableCell[] {
    return [...this.cells];
  }

  /**
   * Set the widths of all SuTableCell elements in this row
   * @param widths Array of widths to set
   */
  setWidths(widths: number[]) {
    this.cells.forEach((cell, index) => {
      cell.setWidth(widths[index]);
    });
  }
}

customElements.define("su-table-row", SuTableRow);
