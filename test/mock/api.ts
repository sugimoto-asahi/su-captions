// https://developer.adobe.com/premiere-pro/uxp/ppro_reference/classes/framerate/
export class FrameRate {
  value!: number;
  constructor(value: number) {
    this.value = value;
  }
  static createWithValue(value: number) {
    return new FrameRate(value);
  }
}

export class TickTime {
  seconds: number;
  constructor(seconds: number) {
    this.seconds = seconds;
  }

  createWithFrameAndFrameRate(frameCount: number, frameRate: FrameRate) {
    return new TickTime(frameCount / frameRate.value);
  }
}

export const ppro = {
  // https://developer.adobe.com/premiere-pro/uxp/ppro_reference/classes/framerate/
  FrameRate: FrameRate,
  // https://developer.adobe.com/premiere-pro/uxp/ppro_reference/classes/ticktime/
  TickTime: {
    createWithFrameAndFrameRate: (
      frameCount: number,
      frameRate: { value: number },
    ) => ({
      seconds: frameCount / frameRate.value,
    }),
  },
};

export const ufs = {};
