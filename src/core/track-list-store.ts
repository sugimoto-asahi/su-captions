import {Store} from "@core/store"

export interface TrackListData {
    tracks: string[];
}

class TrackListStore extends Store<TrackListData> {
    constructor() {
        super({
            tracks: []
        })
    }

    addTrack(track: string) {
        this.set({
            tracks: [...this.get().tracks, track]
        })
    }

    removeTrack(track: string) {
        this.set({
            tracks: this.get().tracks.filter((t) => t !== track)
        })
    }
}

export const trackListStore = new TrackListStore();

