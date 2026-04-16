import { Store } from "@core/store";

export interface WidthData {
    widths: number[];
}

class WidthStore extends Store<WidthData> {
    constructor() {
        super({
            widths: [0, 0, 0, 0]
        })
    }
}

export const widthStore = new WidthStore();