import { Store } from "@core/store";

/**
 * Map of a row column id to its width
 */
export interface WidthData {
    widthMap: {
        [key: string]: number
    }
}

class WidthStore extends Store<WidthData> {
    constructor() {
        super({
            widthMap: {}
        })
    }
}

export const widthStore = new WidthStore();
