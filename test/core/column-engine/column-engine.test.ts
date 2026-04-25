import { describe, it, expect } from "vitest";
import { ColumnEngine, DuplicateColumnError } from "@core/column-engine";

describe("constructor", () => {
  it("creates a ColumnEngine instance", () => {
    expect(new ColumnEngine(["a", "b", "c"], 300)).toBeInstanceOf(ColumnEngine);
  });

  it("assigns equal widths to all columns", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    expect(engine.getWidth("a")).toBe(100);
    expect(engine.getWidth("b")).toBe(100);
    expect(engine.getWidth("c")).toBe(100);
  });

  it("handles a single column", () => {
    const engine = new ColumnEngine(["only"], 200);
    expect(engine.getWidth("only")).toBe(200);
  });

  it("handles non-integer widths", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 100);
    expect(engine.getWidth("a")).toBeCloseTo(33.33);
  });

  it("throws when duplicate column detected", () => {
    expect(() => new ColumnEngine(["same", "same"], 100)).toThrow(
      DuplicateColumnError,
    );
  });
});

describe("getWidth", () => {
  it("returns the current width of a column", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    expect(engine.getWidth("a")).toBe(100);
  });

  it("returns undefined for an unknown column name", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    expect(engine.getWidth("z")).toBeUndefined();
  });
});

describe("isLastColumn", () => {
  it("returns true for the last column", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    expect(engine.isLastColumn("c")).toBe(true);
  });

  it("returns false for non-last columns", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    expect(engine.isLastColumn("a")).toBe(false);
    expect(engine.isLastColumn("b")).toBe(false);
  });

  it("returns true for the only column", () => {
    const engine = new ColumnEngine(["only"], 100);
    expect(engine.isLastColumn("only")).toBe(true);
  });
});

describe("resizeAbsolute", () => {
  it("updates the resized column's width", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.resizeAbsolute("a", 50);
    expect(engine.getWidth("a")).toBe(50);
  });

  it("adjusts the right neighbour so the pair's total is preserved", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.resizeAbsolute("a", 50);
    // a was 100, b was 100; a shrinks by 50, b gains 50
    expect(engine.getWidth("b")).toBe(150);
  });

  it("does not affect columns beyond the right neighbour", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.resizeAbsolute("a", 50);
    expect(engine.getWidth("c")).toBe(100);
  });

  it("does not resize the last column", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.resizeAbsolute("c", 50);
    expect(engine.getWidth("c")).toBe(100);
  });

  it("allows resizing a middle column", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.resizeAbsolute("b", 50);
    expect(engine.getWidth("b")).toBe(50);
    expect(engine.getWidth("c")).toBe(150);
    expect(engine.getWidth("a")).toBe(100);
  });
});

describe("resizeDelta", () => {
  it("increases the width of a column by the specified delta", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    engine.resizeDelta("a", 50);
    expect(engine.getWidth("a")).toBe(150);
  });

  it("decreases the width of a column by the specified delta", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    engine.resizeDelta("a", -50);
    expect(engine.getWidth("a")).toBe(50);
  });

  it("does not change widths if delta is 0", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    engine.resizeDelta("a", 0);
    expect(engine.getWidth("a")).toBe(100);
    expect(engine.getWidth("b")).toBe(100);
  });
});

describe("updateMaxWidth", () => {
  it("scales all columns proportionally when growing", () => {
    const engine = new ColumnEngine(["a", "b", "c"], 300);
    engine.updateMaxWidth(600);
    expect(engine.getWidth("a")).toBeCloseTo(200);
    expect(engine.getWidth("b")).toBeCloseTo(200);
    expect(engine.getWidth("c")).toBeCloseTo(200);
  });

  it("scales all columns proportionally when shrinking", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    engine.updateMaxWidth(100);
    expect(engine.getWidth("a")).toBeCloseTo(50);
    expect(engine.getWidth("b")).toBeCloseTo(50);
  });

  it("preserves relative proportions after a resize", () => {
    const engine = new ColumnEngine(["a", "b"], 200);
    engine.resizeAbsolute("a", 50); // a=50, b=150
    engine.updateMaxWidth(400); // ratio 2×
    expect(engine.getWidth("a")).toBeCloseTo(100);
    expect(engine.getWidth("b")).toBeCloseTo(300);
  });
});
