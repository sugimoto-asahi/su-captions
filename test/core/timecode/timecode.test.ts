import { describe, it, expect } from "vitest"
import { Timecode } from "@core/timecode"
import { settings } from "@core/settings-store"

describe("constructor()", () => {
    it("creates a new Timecode object", () => {
        const tc = new Timecode({ hours: 1, minutes: 2, seconds: 3, frames: 4 })
        expect(tc).toBeInstanceOf(Timecode)
    })

    it("does not allow minutes >=60", () => {
        expect(() => new Timecode({ hours: 0, minutes: 61, seconds: 0, frames: 0 })).toThrow();
        expect(() => new Timecode({ hours: 0, minutes: 60, seconds: 0, frames: 0 })).toThrow();
        expect(() => new Timecode({ hours: 0, minutes: 59, seconds: 0, frames: 0 })).not.toThrow();
    })

    it("does not allow seconds >=60", () => {
        expect(() => new Timecode({ hours: 0, minutes: 0, seconds: 61, frames: 0 })).toThrow();
        expect(() => new Timecode({ hours: 0, minutes: 0, seconds: 60, frames: 0 })).toThrow();
        expect(() => new Timecode({ hours: 0, minutes: 0, seconds: 59, frames: 0 })).not.toThrow();
    })

    it("does not allow frames to be greater than the specified framerate", () => {
        expect(() => new Timecode({ hours: 0, minutes: 0, seconds: 0, frames: settings.get().frameRate })).toThrow();
        expect(() => new Timecode({ hours: 0, minutes: 0, seconds: 0, frames: settings.get().frameRate - 1 })).not.toThrow();
    })
})

describe("toString()", () => {
    it("pads single-digit values", () => {
        const tc = new Timecode({ hours: 1, minutes: 2, seconds: 3, frames: 4 })
        expect(tc.toString()).toBe("01:02:03:04")
        const tc2 = new Timecode({ hours: 0, minutes: 0, seconds: 0, frames: 0 })
        expect(tc2.toString()).toBe("00:00:00:00")
    })

    it("does not pad double-digit values", () => {
        const tc = new Timecode({ hours: 10, minutes: 20, seconds: 30, frames: 24 })
        expect(tc.toString()).toBe("10:20:30:24")
    })
})
