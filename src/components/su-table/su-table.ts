import { SuElement } from "@core/su-element";
import { SuTableRow } from "@components/su-table-row";
import styles from "./su-table.css?inline";


class SuTable extends SuElement(styles) {
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
    const row = document.createElement('su-table-row') as SuTableRow;
    const cell1 = document.createElement('su-table-cell');
    const cell2 = document.createElement('su-table-cell');
    const cell3 = document.createElement('su-table-cell');

    cell1.textContent = '1';
    cell2.textContent = '2';
    cell3.textContent = '3';

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    // const table = this.shadowRoot?.querySelector(".table");
    // table?.appendChild(row);
    this.appendChild(row);
    row.setWidths([100, 200, 300]);
  }
}

customElements.define('su-table', SuTable);
