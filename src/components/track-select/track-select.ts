import styles from "./track-select.css?inline"
import { SuElement } from "@core/su-element";
import { trackListStore } from "@core/track-list-store";
import type { MenuItem } from "@components/menu-item"
import { TrackSelectEvent } from "@components/menu-item"
import "@components/menu-item"

import "@swc-uxp-internal/icons-workflow/icons/sp-icon-chevron-down"

export class TrackSelect extends SuElement(styles) {
    override template(): string {
        return `
        <div class="dropdown-box">
            <div class="current">
                Select a track...
            </div>
            <div class="dropdown-icon">
                <sp-icon-chevron-down width="24" height="24"></sp-icon-chevron-down>
            </div>
        </div>
        <div class="tracks" hidden></div>
        `;
    }

    override then(): void {
        const current = this.shadowRoot!.querySelector(".current") as HTMLElement;
        const dropdownBox = this.shadowRoot!.querySelector(".dropdown-box") as HTMLElement;
        const tracks = this.shadowRoot!.querySelector(".tracks") as HTMLElement;

        trackListStore.subscribe((store) => {
            const menuItems = this.prepareTracks(store.tracks);

            tracks.replaceChildren(...menuItems);
            store.tracks.forEach((track, index) => {
                menuItems[index].setDisplayText(track);
            })
        })

        dropdownBox.addEventListener("click", () => {
            const boundingBox = this.getBoundingClientRect();
            tracks.style.left = boundingBox.left + "px";
            tracks.style.top = boundingBox.bottom + "px";
            tracks.hidden = false;
        })

        this.addEventListener(TrackSelectEvent.type, (event) => {
            const e = event as TrackSelectEvent;
            current.textContent = e.detail.trackName;
            tracks.hidden = true;
        })
    }

    /**
     * Prepare menu track items for display
     * @param tracks List of tracks to create menu items for
     * @returns List of menu items represent each track
     */
    private prepareTracks(tracks: string[]): MenuItem[] {
        let menuItems: MenuItem[] = [];
        tracks.forEach((track) => {
            const menuItem = document.createElement("menu-item") as MenuItem;
            menuItems.push(menuItem);
        })

        return menuItems;
    }
}

customElements.define('track-select', TrackSelect);
