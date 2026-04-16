import { SuElement } from "@core/su-element";
import styles from "./menu-item.css?inline";

export interface TrackSelectDetail {
    trackName: string;
}

export class TrackSelectEvent extends CustomEvent<TrackSelectDetail> {
    static readonly type = "track-selected" as const;

    constructor(detail: TrackSelectDetail) {
        super(TrackSelectEvent.type, {
            detail,
            bubbles: true,
            composed: true,
        });
    }
}


export class MenuItem extends SuElement(styles) {
    private trackName!: HTMLDivElement;

    override template(): string {
        return `
            <div class="track-name">Track Name</div>
            <slot></slot>
        `;
    }

    override then(): void {
        this.trackName = this.shadowRoot!.querySelector(".track-name")!;

        this.addEventListener("click", () => {
            this.dispatchEvent(new TrackSelectEvent({
                trackName: this.trackName.textContent ?? ""
            }));
        });
    }

    /**
     * Set the display text of this menu item
     * @param text 
     */
    setDisplayText(text: string) {
        this.trackName.textContent = text;
    }
}

customElements.define('menu-item', MenuItem);