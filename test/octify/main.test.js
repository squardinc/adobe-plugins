const { describe, test, expect } = require("@jest/globals");
const { octify } = require("../../xd/octify/main");

describe("Octify", () => {
  describe("Octify", () => {
    test("round down", () => {
      expect(octify(8.1)).toBe(8);
      expect(octify(19.9)).toBe(16);
    });
    test("round up", () => {
      expect(octify(7.9)).toBe(8);
      expect(octify(20)).toBe(24);
    });
    test("no change if divisible", () => {
      expect(octify(8)).toBe(8);
      expect(octify(16)).toBe(16);
    });
  });
});
