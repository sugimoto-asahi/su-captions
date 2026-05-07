import { storage } from "uxp";
import Ajv from "ajv";
import schema from "@core/captions.schema.json";
import {
  CaptionFile,
  DuplicateIdError,
  type CaptionFileData,
} from "./caption-file";
import { Store } from "@core/store";

export interface CaptionsData {
  captionFile: CaptionFile | null;
}

/**
 * Global singleton store for all captions in a project.
 */
class CaptionStore extends Store<CaptionsData> {
  captionFile!: CaptionFile;

  constructor() {
    super({
      captionFile: null,
    });
  }

  /**
   * Ingest a caption file and parse all caption data.
   * @param file UXP File object to ingest
   * @throws {Error} if the input is not valid JSON or fails schema validation
   */
  async init(file: storage.File): Promise<void> {
    const captionFile = await this.#getCheckedCaptions(file);
    this.set({
      captionFile: captionFile,
    });
  }

  /**
   * Parse and validate caption input against the schema.
   * @note The schema does not enforce the uniqueness of track names
   */
  async #getCheckedCaptions(file: storage.File): Promise<CaptionFile> {
    const rawJson = await this.#readFile(file);

    let json: unknown;
    try {
      json = JSON.parse(rawJson);
    } catch (e) {
      console.error(e);
      throw e;
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (!validate(json)) {
      const message = `Invalid caption file: ${ajv.errorsText(validate.errors)}`;
      console.error(validate.errors);
      throw new Error(message);
    }

    const duplicateId = this.findDuplicateId(json as CaptionFileData);
    if (duplicateId !== null) {
      throw new DuplicateIdError(duplicateId);
    }

    return new CaptionFile(json as CaptionFileData);
  }

  /**
   * Find a duplicate Id in the caption file
   *
   * @param data Caption file data
   * @returns The first duplicate id found
   */
  private findDuplicateId(data: CaptionFileData): number | null {
    const seen = new Set<number>();
    for (const track of data.tracks) {
      for (const caption of track.captions) {
        if (seen.has(caption.id)) {
          return caption.id;
        }
        seen.add(caption.id);
      }
    }
    return null;
  }

  /**
   * Read a UTF-8 file's text content.
   */
  async #readFile(file: storage.File): Promise<string> {
    return file.read({ format: storage.formats.utf8 });
  }
}

export const captionStore = new CaptionStore();
