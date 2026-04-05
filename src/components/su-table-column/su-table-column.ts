import { SuElement } from "@core/su-element";
import styles from "./su-table-column.css?inline";


class SuTableColumn extends SuElement(styles) {
  override render() {
    return `<h1>hello</h1>`;
  }
}

customElements.define('su-table-column', SuTableColumn);