import { SuElement } from "@core/su-element";
import { SuTableCell } from "@components/su-table-cell";
import styles from "./su-table-row.css?inline";


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
  override connectedCallback(): void {
    super.connectedCallback();
  }

  override template(): string {
    return `
    <slot></slot>
    `;
  }

  override then(): void {
    this.cells = this.querySelectorAll('su-table-cell') as NodeListOf<SuTableCell>;
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
    this.cells?.forEach((cell, index) => {
      cell.setWidth(widths[index]);
    });
  }
}

customElements.define('su-table-row', SuTableRow);
