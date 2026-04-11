import { describe, it, expect } from "vitest"
import { CaptionTrack, type CaptionTrackData } from "@core/caption-track"

// TODO: a valid timecode needs to have the end after the start,
// so we should make a helper function to make a valid timecode
// instead of specifying valid start and end timecodes for every test
// that needs to use timecodes, even if they don't have anything to do
// with timecodes.
const start = { hours: 0, minutes: 0, seconds: 0, frames: 0 };
const end = { hours: 0, minutes: 0, seconds: 0, frames: 1 };

const makeTrack = (name: string, captions: CaptionTrackData["captions"] = []): CaptionTrack =>
    new CaptionTrack({ name, captions });

describe("constructor()", () => {
    it("creates a CaptionTrack instance", () => {
        expect(makeTrack("Track A")).toBeInstanceOf(CaptionTrack);
    })

    it("accepts an empty captions array", () => {
        expect(() => makeTrack("Empty Track", [])).not.toThrow();
    })

    it("accepts a non-empty captions array", () => {
        const caption = { startTimecode: start, endTimecode: end, content: "Hello" };
        expect(() => makeTrack("Track A", [caption])).not.toThrow();
    })
})

describe("name", () => {
    it("returns the right name", () => {
        expect(makeTrack("My Track").name).toBe("My Track");
    })

    it("preserves the exact name string", () => {
        const name = "  Track with spaces  ";
        expect(makeTrack(name).name).toBe(name);
    })
})
