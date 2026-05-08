import { describe, it, expect } from "vitest";
import { Timecode } from "@core/timecode";
import { tickTimeToTimecode, timecodeToTickTime } from "@core/utils/time";
import type { TickTime } from "@localTypes/premierepro";

const makeTickTime = (seconds: number) => ({ seconds }) as unknown as TickTime;

describe("tickTimeToTimecode", () => {
  it("converts zero time", () => {
    expect(tickTimeToTimecode(makeTickTime(0), 60).toString()).toBe(
      "00:00:00:00",
    );
  });

  it("converts a single frame", () => {
    expect(tickTimeToTimecode(makeTickTime(1 / 60), 60).toString()).toBe(
      "00:00:00:01",
    );
  });

  it("rolls frames into seconds", () => {
    expect(tickTimeToTimecode(makeTickTime(1), 60).toString()).toBe(
      "00:00:01:00",
    );
  });

  it("rolls seconds into minutes", () => {
    expect(tickTimeToTimecode(makeTickTime(60), 60).toString()).toBe(
      "00:01:00:00",
    );
  });

  it("rolls minutes into hours", () => {
    expect(tickTimeToTimecode(makeTickTime(3600), 60).toString()).toBe(
      "01:00:00:00",
    );
  });

  it("decomposes a complex time correctly", () => {
    const totalFrames = 1 * 3600 * 60 + 2 * 60 * 60 + 3 * 60 + 4;
    expect(
      tickTimeToTimecode(makeTickTime(totalFrames / 60), 60).toString(),
    ).toBe("01:02:03:04");
  });

  it("respects a different framerate", () => {
    expect(tickTimeToTimecode(makeTickTime(1 / 24), 24).toString()).toBe(
      "00:00:00:01",
    );
  });

  it("returns a Timecode instance", () => {
    expect(tickTimeToTimecode(makeTickTime(0), 60)).toBeInstanceOf(Timecode);
  });
});

describe("timecodeToTickTime", () => {
  it("converts zero time", () => {
    const tc = new Timecode({ hours: 0, minutes: 0, seconds: 0, frames: 0 });
    expect(timecodeToTickTime(tc, 60).seconds).toBe(0);
  });

  it("converts a simple timecode", () => {
    const tc = new Timecode({ hours: 0, minutes: 0, seconds: 1, frames: 0 });
    expect(timecodeToTickTime(tc, 60).seconds).toBe(1);
  });

  it("converts a complex timecode", () => {
    const tc = new Timecode({ hours: 1, minutes: 2, seconds: 3, frames: 4 });
    expect(timecodeToTickTime(tc, 60).seconds).toBeCloseTo(3723.067, 3);
  });
});
