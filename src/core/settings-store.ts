import { Store, Listener } from "@core/store";

const fs = require("fs");

export interface SettingsData {
    captionFile: string;
    frameRate: number;
}

class SettingsStore extends Store<SettingsData> {
    constructor() {
        super({
            captionFile: "undefined",
            frameRate: 0
        });
    }

    initSettings(settingsFilePath: string) {
        const data: SettingsData = JSON.parse(fs.readFileSync(settingsFilePath, "utf-8"));
        this.set(data);
    }

    isCaptionsFileSpecified(): boolean {
        return this.get().captionFile !== "";
    }

    getCaptionFilepath(): string {
        return this.get().captionFile;
    }
}

export const settings = new SettingsStore();

