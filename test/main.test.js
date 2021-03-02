const { describe, test, expect } = require("@jest/globals");
const { octify } = require("/Users/yuuki/Library/Application Support/Adobe/Adobe XD/develop/octify/main.js");

describe("Octify", () => {
  describe("Octify", () => {
    test("8で割ったあまりが０.５未満の場合は８を返す", () => {
      expect(octify(0)).toBe(8);
      expect(octify(3.9)).toBe(8);
    })
    test("round down", () => {
      expect(octify(8.1)).toBe(8);
      expect(octify(19.9)).toBe(16);
    });
    test("round up", () => {
      expect(octify(4)).toBe(8);
      expect(octify(7.9)).toBe(8);
      expect(octify(20)).toBe(24);
    });
    test("no change if divisible", () => {
      expect(octify(8)).toBe(8);
      expect(octify(16)).toBe(16);
    }); 
  });
});
