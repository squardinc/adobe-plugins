const { describe, test, expect } = require("@jest/globals");
const {
  ratioArray,
  adjust,
  toNextHeight,
} = require("../../xd/RatioHunter/main");

describe("RatioHunter", () => {
  describe("hunt", () => {
    let width = 10;
    let height = 1;
    test("order", () => {
      ratioArray.forEach((ratio, idx, arr) => {
        expect(toNextHeight(height, width)).toBeGreaterThan(height);
      });
    });
    test("back to the first ratio", () => {
      expect(toNextHeight(height, width)).toBe(toNextHeight(1, width));
    });

    describe("adjust", () => {
      test("round up", () => {
        expect(adjust(1, 0.5)).toBe(1);
      });
      test("round down", () => {
        expect(adjust(1, 0.4)).toBe(0);
      });
    });
  });
});
