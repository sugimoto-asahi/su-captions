import type { SettingsData } from "@core/settings";

export const settings =  {
    get(): SettingsData {
        return {
            captionFile: "dummy caption file",
            frameRate: 60
        }
    }
}