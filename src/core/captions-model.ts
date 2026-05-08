/**
 * Runtime caption model
 */

import { CaptionsData } from "./caption-store";
import { CaptionTrack } from "./caption-track";
import { TrackNotFoundError } from "./caption-file";

class CaptionsModel {
  private tracksMap: Map<string, CaptionTrack> = new Map();
  /**
   * Constructor
   *
   * then the CaptionModel will be initiated as empty.
   */
  constructor() {}

  /**
   * Load pre-existing caption data
   *
   * @param captionsData Existing caption data to load into the model.
   * Will replace existing data in this object
   */
  loadData(captionsData: CaptionsData) {
    const captionFile = captionsData.captionFile!;
    this.tracksMap = captionFile.tracksMap;
  }

  getTrack(trackName: string): CaptionTrack {
    const track = this.tracksMap.get(trackName);
    if (!track) {
      throw new TrackNotFoundError(trackName);
    }
    return track;
  }
}

export const captionsModel = new CaptionsModel();
