export type Timecode = {
    hours: number;
    minutes: number;
    seconds: number;
    frames: number;
}

export type Caption = {
    id: number;
    startTimecode: Timecode;
    endTimecode: Timecode;
    caption: string;
}