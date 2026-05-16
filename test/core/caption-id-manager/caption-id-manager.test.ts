import { describe, it, expect } from "vitest";
import {
  CaptionIdManager,
  DuplicateCaptionIdError,
  NoSuchCaptionIdError,
} from "@core/caption-id-manager";

describe("construction", () => {
  it("does not throw", () => {
    expect(() => {
      new CaptionIdManager();
    }).not.toThrow();
  });
});

describe("add()", () => {
  it("adds without throwing", () => {
    const manager = new CaptionIdManager();
    expect(() => manager.add(1)).not.toThrow();
    expect(() => manager.add(3)).not.toThrow();
    expect(() => manager.add(4)).not.toThrow();
    expect(() => manager.add(2)).not.toThrow();
    expect(() => manager.add(7)).not.toThrow();
  });

  it("throws when attempting to add an existing ID", () => {
    const manager = new CaptionIdManager();
    expect(() => manager.add(1)).not.toThrow();
    expect(() => manager.add(1)).toThrow(DuplicateCaptionIdError);
    expect(() => manager.add(2)).not.toThrow();
    expect(() => manager.add(2)).toThrow(DuplicateCaptionIdError);
  });
});

describe("remove()", () => {
  it("throws when attempting to remove a non-existent ID", () => {
    const manager = new CaptionIdManager();
    expect(() => manager.remove(1)).toThrow(NoSuchCaptionIdError);
    manager.add(1);
    expect(() => manager.remove(1)).not.toThrow();

    expect(() => manager.remove(2)).toThrow(NoSuchCaptionIdError);
    manager.add(2);
    expect(() => manager.remove(2)).not.toThrow();
  });
});

describe("isIdInUse()", () => {
  it("checks if the id is in use correctly", () => {
    const manager = new CaptionIdManager();
    expect(manager.isIdInUse(1)).toBe(false);
    manager.add(1);
    expect(manager.isIdInUse(1)).toBe(true);

    expect(manager.isIdInUse(2)).toBe(false);
    manager.add(2);
    expect(manager.isIdInUse(2)).toBe(true);
  });
});

describe("getAvailableId()", () => {
  it("returns 1 if there are no existing ids", () => {
    const manager = new CaptionIdManager();
    expect(manager.getAvailableId()).toBe(1);
  });
  it("returns the next available ID correctly", () => {
    const manager = new CaptionIdManager();
    manager.add(1);
    expect(manager.getAvailableId()).toBe(2);

    manager.add(2);
    expect(manager.getAvailableId()).toBe(3);

    manager.add(4);
    expect(manager.getAvailableId()).toBe(3);

    manager.add(5);
    expect(manager.getAvailableId()).toBe(3);

    manager.add(3);
    expect(manager.getAvailableId()).toBe(6);
  });
});

describe("e2e", () => {
  it("handles adding and removing ids correctly", () => {
    const manager = new CaptionIdManager();
    expect(manager.getAvailableId()).toBe(1);
    manager.add(1);
    expect(manager.isIdInUse(1)).toBe(true);

    expect(manager.getAvailableId()).toBe(2);
    manager.add(2);
    expect(manager.isIdInUse(2)).toBe(true);

    manager.remove(1);
    expect(manager.getAvailableId()).toBe(1);
    manager.add(1);

    manager.add(3);
    manager.remove(2);
    expect(manager.getAvailableId()).toBe(2);
    manager.add(2);
    expect(manager.getAvailableId()).toBe(4);

    manager.add(4);
    manager.remove(1);
    manager.remove(2);
    expect(manager.getAvailableId()).toBe(1);
    manager.add(1);
    expect(manager.getAvailableId()).toBe(2);
  });
});
