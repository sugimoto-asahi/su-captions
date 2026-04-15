import { Store, Listener } from "@core/store";

const fs = require("fs");

export interface SettingsData {
    captionFile: string;
    frameRate: number;
}


class Settings {
    store!: Store<SettingsData>;
    #settingsFilePath!: string;

    constructor() {
        this.store = new Store({
            captionFile: "undefined",
            frameRate: 0
        })
    }

    initSettings(settingsFilePath: string) {
        const data: SettingsData = JSON.parse(fs.readFileSync(settingsFilePath, "utf-8"));
        this.store = new Store(data);
        this.#settingsFilePath = settingsFilePath;
    }

    isCaptionsFileSpecified(): boolean {
        return this.store.get().captionFile !== "";
    }

    setCaptionFilepath(captionFilepath: string) {
        this.store.set({ captionFile: captionFilepath });
        fs.writeFileSync(this.#settingsFilePath, JSON.stringify(this.store.get()));
    }

    getCaptionFilepath(): string {
        return this.store.get().captionFile;
    }

    subscribe(listener: Listener<SettingsData>): () => void {
        return this.store.subscribe(listener);
    }

    get(): SettingsData {
        return this.store.get();
    }
}

export const settings = new Settings();

