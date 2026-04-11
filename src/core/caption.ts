import { Timecode, type TimecodeData } from './timecode';


export class CaptionError extends Error {
    constructor(startTimecode: Timecode, endTimecode: Timecode) {
        super(`Start timecode "${startTimecode}" must be before end timecode "${endTimecode}".`);
        this.name = "CaptionError"
    }
}

export type CaptionData = {
    startTimecode: TimecodeData;
    endTimecode: TimecodeData;
    content: string;
};

export class Caption {
    #startTimecode: Timecode;
    #endTimecode: Timecode;
    #content: string;

    constructor({ startTimecode, endTimecode, content }: CaptionData) {
        this.#startTimecode = new Timecode(startTimecode);
        this.#endTimecode = new Timecode(endTimecode);
        this.#content = content;

        if (this.#startTimecode >= this.#endTimecode) {
            throw new CaptionError(this.#startTimecode, this.#endTimecode);
        }
    }

    get startTimecode(): Timecode {
        return this.#startTimecode;
    }

    get endTimecode(): Timecode {
        return this.#endTimecode;
    }

    get content(): string {
        return this.#content;
    }
}
