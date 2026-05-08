import { captionStore } from "@core/caption-store";
import { captionsModel } from "@core/captions-model";
import type { SuTable } from "@components/su-table";
import {
  controlEventBus,
  AddCaptionEvent,
  RemoveCaptionEvent,
} from "./control-event-bus";
export class SuTableAdapter {
  private table: SuTable;
  constructor(table: SuTable) {
    this.table = table;

    // load in the caption file from disk as soon as available
    captionStore.subscribe((captionsData) => {
      captionsModel.loadData(captionsData);
    });

    controlEventBus.subscribe(AddCaptionEvent.type, (detail) => {
      // TODO
    });

    controlEventBus.subscribe(RemoveCaptionEvent.type, (detail) => {
      // TODO
    });
  }
}
