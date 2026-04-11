import { describe, it, expect } from "vitest"
import { CaptionFile, type CaptionFileData, CaptionFileError, TrackNotFoundError } from "@core/caption-file"
import { CaptionTrack } from "@core/caption-track"

const start = { hours: 0, minutes: 0, seconds: 0, frames: 0 };
const end = { hours: 0, minutes: 0, seconds: 0, frames: 1 };
const caption = { startTimecode: start, endTimecode: end, content: "Hello" };

const makeCaptionFile = (tracks: CaptionFileData["tracks"]): CaptionFile =>
    new CaptionFile({ tracks });


const twoTrackFile: CaptionFileData = {
    tracks: [
        { name: "Track A", captions: [caption] },
        { name: "Track B", captions: [] },
    ]
};

const duplicateTrackFile: CaptionFileData = {
    tracks: [
        { name: "Track A", captions: [] },
        { name: "Track A", captions: [] },
    ]
};

describe("constructor()", () => {
    it("creates a CaptionFile with no tracks", () => {
        const file = makeCaptionFile([]);
        expect(file).toBeInstanceOf(CaptionFile);
    })

    it("creates a CaptionFile with multiple tracks", () => {
        expect(() => new CaptionFile(twoTrackFile)).not.toThrow();
    })

    it("disallows tracks with the same name", () => {
        expect(() => new CaptionFile(duplicateTrackFile)).toThrow(CaptionFileError);
    })
})

describe("getTrackNames()", () => {
    it("returns an empty array when there are no tracks", () => {
        const file = makeCaptionFile([]);
        expect(file.getTrackNames()).toEqual([]);
    })

    it("returns the names of all tracks", () => {
        const file = new CaptionFile(twoTrackFile);
        expect(file.getTrackNames()).toEqual(["Track A", "Track B"]);
    })
})

describe("getTrack()", () => {
    it("returns the correct CaptionTrack by name", () => {
        const file = new CaptionFile(twoTrackFile);
        const track = file.getTrack("Track A");
        expect(track).toBeInstanceOf(CaptionTrack);
        expect(track.name).toBe("Track A");
    })

    it("throws when the track name does not exist", () => {
        const file = new CaptionFile(twoTrackFile);
        expect(() => file.getTrack("Nonexistent")).toThrow(TrackNotFoundError);
    })
})
