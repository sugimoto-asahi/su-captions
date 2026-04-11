import { Store, Listener } from "@core/store";
import { ppro, ufs } from "@core/api";
import { storage } from "uxp";

const SETTINGS_FILENAME = "settings.su";

interface SettingsData {
    captionFile: string;
    frameRate: number;
}

class Settings {
    #store: Store<SettingsData>;
    #settingsFile: storage.File;

    /**
     * Primarily invoked by Settings.load()
     * @param data Data read from the settings file, in object form
     * @param settingsFile File handle to the settings file
     */
    constructor(data: SettingsData, settingsFile: storage.File) {
        this.#store = new Store(data);
        this.#settingsFile = settingsFile;
    }

    /**
     * Searches for the settings file in the directory the premiere pro
     * project running this plugin lives in. When found, parses the file
     * and constructs a new Settings object ready for use.
     * @returns Settings object (promise)
     */
    static async load(): Promise<Settings> {
        const project = await ppro.Project.getActiveProject();
        // remove long path prefix '\\?\'
        const projectPath = project.path.slice(4);
        const projectDirectory = window.path.dirname(projectPath);

        const projectFolder = await ufs.getEntryWithUrl(projectDirectory) as storage.Folder;
        const settingsFile = await projectFolder.getEntry(SETTINGS_FILENAME) as storage.File;
        const contents = await settingsFile.read({ format: storage.formats.utf8 });
        const data: SettingsData = JSON.parse(contents as string);

        return new Settings(data, settingsFile);
    }

    isCaptionsFileSpecified(): boolean {
        return this.#store.get().captionFile !== "";
    }

    async setCaptionFilepath(captionFilepath: string) {
        this.#store.set({ captionFile: captionFilepath });
        await this.#settingsFile.write(JSON.stringify(this.#store.get()), { format: storage.formats.utf8 });
    }

    getCaptionFilepath(): string {
        return this.#store.get().captionFile;
    }

    subscribe(listener: Listener<SettingsData>): () => void {
        return this.#store.subscribe(listener);
    }

    get(): SettingsData {
        return this.#store.get();
    }
}

export let settings: Settings;

/**
 * Call this to load settings from the settings file first,
 * otherwise the settings variable above is invalid.
 */
export async function loadSettings(): Promise<void> {
    settings = await Settings.load();
}
