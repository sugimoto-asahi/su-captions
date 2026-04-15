import { settings } from "@core/settings-store";

export type TimecodeData = {
    hours: number;
    minutes: number;
    seconds: number;
    frames: number;
};

export class Timecode {
    #hours: number;
    #minutes: number;
    #seconds: number;
    #frames: number;
    framerate: number;

    constructor({ hours, minutes, seconds, frames }: TimecodeData) {
        this.#hours = hours;
        this.#minutes = minutes;
        this.#seconds = seconds;
        this.#frames = frames;
        this.framerate = settings.get().frameRate;
        this.#validate();
    }

    toString(): string {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(this.#hours)}:${pad(this.#minutes)}:${pad(this.#seconds)}:${pad(this.#frames)}`;
    }

    #validate() {
        if (this.#minutes >= 60) {
            throw new Error("Minutes must be less than 60");
        }
        if (this.#seconds >= 60) {
            throw new Error("Seconds must be less than 60");
        }
        if (this.#frames >= this.framerate) {
            throw new Error("Frames must be less than the maximum framerate");
        }
    }

    valueOf(): number {
        let sum = 0;
        sum += this.#hours * 60 * 60 * this.framerate;
        sum += this.#minutes * 60 * this.framerate;
        sum += this.#seconds * this.framerate;
        sum += this.#frames;
        return sum;
    }
}
