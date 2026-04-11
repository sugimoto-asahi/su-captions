import { readFileSync } from "node:fs";

const utf8 = Symbol('utf8');
const binary = Symbol('binary');

/**
 * Mock implementation of storage.File
 */
class FileMock {
    isFile: any = true;

    mode: symbol = Symbol('readOnly');

    #content: string;

    constructor(path: string)
    constructor(raw: string, fromRaw: true)
    constructor(arg: string, fromRaw?: true) {
        this.#content = fromRaw ? arg : readFileSync(arg, 'utf8');
    }

    read(options?: { format?: symbol }): Promise<string | ArrayBuffer> {
        return Promise.resolve(this.#content);
    }

    write(data: string | ArrayBuffer, options?: { format?: symbol; append?: boolean }): Promise<number> {
        return Promise.resolve(0);
    }

    static isFile(entry: any): boolean {
        return entry instanceof FileMock;
    }
}

export const storage = {
    formats: {
        utf8,
        binary,
    },
    File: FileMock,
};
