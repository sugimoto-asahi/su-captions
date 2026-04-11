import { describe, it, expect } from "vitest"
import { Caption, CaptionError, type CaptionData } from "@core/caption"
import { Timecode } from "@core/timecode"

const makeTimecode = (hours: number, minutes: number, seconds: number, frames: number) =>
    ({ hours, minutes, seconds, frames });

const makeCaption = (overrides: Partial<CaptionData> = {}): Caption =>
    new Caption({
        startTimecode: makeTimecode(0, 0, 0, 0),
        endTimecode: makeTimecode(0, 0, 0, 1),
        content: "Hello",
        ...overrides,
    });

const caption1 = makeCaption({
    startTimecode: makeTimecode(0, 0, 0, 0),
    endTimecode: makeTimecode(1, 1, 1, 1)
});

const caption2 = makeCaption({
    startTimecode: makeTimecode(1, 2, 3, 4),
    endTimecode: makeTimecode(2, 3, 4, 5)
});

describe("constructor", () => {
    it("creates a Caption instance", () => {
        expect(makeCaption()).toBeInstanceOf(Caption);
    })

    it("accepts an empty content string", () => {
        expect(() => makeCaption({ content: "" })).not.toThrow();
    })
})

describe("startTimecode", () => {
    it("returns a Timecode instance", () => {
        expect(makeCaption().startTimecode).toBeInstanceOf(Timecode);
    })

    it("returns the correct start timecode", () => {
        expect(caption1.startTimecode.toString()).toBe("00:00:00:00");
        expect(caption2.startTimecode.toString()).toBe("01:02:03:04");
    })
})

describe("endTimecode", () => {
    it("returns a Timecode instance", () => {
        expect(makeCaption().endTimecode).toBeInstanceOf(Timecode);
    })

    it("returns the correct end timecode", () => {
        expect(caption1.endTimecode.toString()).toBe("01:01:01:01");
        expect(caption2.endTimecode.toString()).toBe("02:03:04:05");
    })
})

describe("content", () => {
    it("returns the content string", () => {
        const caption = makeCaption({ content: "Some caption text" });
        expect(caption.content).toBe("Some caption text");
    })
})

describe("timecode ordering validation", () => {
    it("throws when start is after end", () => {
        expect(() => makeCaption({
            startTimecode: makeTimecode(0, 0, 5, 0),
            endTimecode: makeTimecode(0, 0, 1, 0),
        })).toThrow(CaptionError);
    })

    it("throws when start is equal to end", () => {
        expect(() => makeCaption({
            startTimecode: makeTimecode(0, 0, 5, 0),
            endTimecode: makeTimecode(0, 0, 5, 0),
        })).toThrow(CaptionError);
    })
})
