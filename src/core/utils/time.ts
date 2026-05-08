import { ppro } from "@core/api";
import { Timecode } from "@core/timecode";
import type { TickTime } from "@localTypes/premierepro";

export function tickTimeToTimecode(
  tickTime: TickTime,
  framerate: number,
): Timecode {
  const totalFrames = Math.floor(tickTime.seconds * framerate);
  const frames = totalFrames % framerate;
  const totalSeconds = Math.floor(totalFrames / framerate);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  return new Timecode({ hours, minutes, seconds, frames });
}

export function timecodeToTickTime(
  timecode: Timecode,
  framerate: number,
): TickTime {
  const frameRate = ppro.FrameRate.createWithValue(framerate);
  return ppro.TickTime.createWithFrameAndFrameRate(
    timecode.valueOf(),
    frameRate,
  );
}
