import { Caption, type CaptionData } from './caption';

export type CaptionTrackData = {
    name: string;
    captions: CaptionData[];
};

export class CaptionTrack {
    #name: string;
    #captions: Caption[];

    constructor({ name, captions }: CaptionTrackData) {
        this.#name = name;
        this.#captions = captions.map(c => new Caption(c));
    }

    get name(): string {
        return this.#name;
    }

    get captions(): Caption[] {
        return this.#captions;
    }
}
