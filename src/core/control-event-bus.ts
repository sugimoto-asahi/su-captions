import { EventBus } from "./event-bus";
import { type Timecode } from "@core/timecode";

export interface AddCaptionDetail {
  startTimecode: Timecode;
  endTimecode: Timecode;
}

export interface RemoveCaptionDetail {}

export class AddCaptionEvent extends CustomEvent<AddCaptionDetail> {
  static readonly type = "add-caption" as const;

  constructor(detail: AddCaptionDetail) {
    super(AddCaptionEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

export class RemoveCaptionEvent extends CustomEvent<RemoveCaptionDetail> {
  static readonly type = "remove-caption" as const;

  constructor(detail: RemoveCaptionDetail) {
    super(RemoveCaptionEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * The event map for all control-related events.
 * Extend this map as new control event types are introduced.
 */
type ControlEventMap = {
  "add-caption": AddCaptionDetail;
  "remove-caption": RemoveCaptionDetail;
};

export const controlEventBus = new EventBus<ControlEventMap>();
