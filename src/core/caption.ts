import { Timecode, type TimecodeData } from "./timecode";

export class CaptionError extends Error {
  constructor(startTimecode: Timecode, endTimecode: Timecode) {
    super(
      `Start timecode "${startTimecode}" must be before end timecode "${endTimecode}".`,
    );
    this.name = "CaptionError";
  }
}

export type CaptionData = {
  id: number;
  startTimecode: TimecodeData;
  endTimecode: TimecodeData;
  content: string;
};

export class Caption {
  id: number;
  startTimecode: Timecode;
  endTimecode: Timecode;
  content: string;

  constructor({ id, startTimecode, endTimecode, content }: CaptionData) {
    this.id = id;
    this.startTimecode = new Timecode(startTimecode);
    this.endTimecode = new Timecode(endTimecode);
    this.content = content;

    if (this.startTimecode >= this.endTimecode) {
      throw new CaptionError(this.startTimecode, this.endTimecode);
    }
  }
}
