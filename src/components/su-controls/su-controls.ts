import {SuElement} from "@core/su-element"
import styles from "./su-controls.css?inline"

export class SuControls extends SuElement(styles) {
    override template() {
        return `
        <slot></slot>
        `;
    }

    override then() {
        const slot = this.shadowRoot!.querySelector("slot");
        const controls = slot!.assignedElements() as HTMLElement[];

        // manual gap implementation since UXP does not support the
        // "gap" CSS property
        const gap = this.getAttribute("gap");
        controls.forEach((control) => {
            control.style.paddingLeft = `${gap}`;
            control.style.paddingRight = `${gap}`;
        })
    }
}

customElements.define("su-controls", SuControls);