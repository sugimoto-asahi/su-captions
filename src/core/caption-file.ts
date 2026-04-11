import { CaptionTrack, type CaptionTrackData } from './caption-track';



export class CaptionFileError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class DuplicateTrackError extends CaptionFileError {
    constructor(trackName: string) {
        super(`Duplicate track name: ${trackName}`);
    }
}

export class TrackNotFoundError extends CaptionFileError {
    constructor(trackName: string) {
        super(`Track "${trackName}" does not exist.`);
    }
}

export type CaptionFileData = {
    tracks: CaptionTrackData[];
};

export class CaptionFile {
    #trackNames: string[] = [];
    #tracksMap: Map<string, CaptionTrack> = new Map();

    constructor({ tracks }: CaptionFileData) {
        // disallow same name tracks
        const trackNames = new Set<string>();
        tracks.forEach((trackData) => {
            if (trackNames.has(trackData.name)) {
                throw new CaptionFileError(`Duplicate track name: ${trackData.name}`);
            }
            trackNames.add(trackData.name);
            this.#trackNames.push(trackData.name);
            this.#tracksMap.set(trackData.name, new CaptionTrack(trackData));
        })
    }

    /**
     * Retrieve list of all track names in this caption file
     * @returns {string[]} List of track names
     */
    getTrackNames(): string[] {
        return this.#trackNames;
    }

    /**
     * Retrieve a track by name.
     * @param name Name of track to retrieve.
     * @returns {CaptionTrack} The track with the specified name.
     * @throws {Error} If the track does not exist.
     */
    getTrack(name: string): CaptionTrack {
        const track = this.#tracksMap.get(name);
        if (!track) {
            throw new TrackNotFoundError(name);
        }
        return track;
    }
}
