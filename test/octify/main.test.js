const { describe, test, expect } = require("@jest/globals");
const { octify ,shouldPlaceToHorizontal} = require("../../xd/octify/main");

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

  describe("shouldPlaceToHorizontal", () => {
    const firstItem = {
      topLeftInParent: {
        x: 0,
        y: 0,
      },
      width: 10,
      height:20,
    }

    const items = [
      firstItem,
      {
        topLeftInParent: {
          x: firstItem.width + 1,
          y: firstItem.height-1,
        },
      },
      {
        topLeftInParent: {
          x: firstItem.width + 0.1,
          y: firstItem.height-0.1,
        },
      }
    ]
    test("true if no items placed in bottom of first item", () => {
      expect(shouldPlaceToHorizontal(items)).toBeTruthy();
    })
    test("false if on or more items placed in bottom of first item", () => {
      const items2 = [
        items[0],
        {
          topLeftInParent: {
            x: items[0].topLeftInParent.x, 
            y: firstItem.height+1,
          }
        },
        items[2],
      ]
      expect(shouldPlaceToHorizontal(items2)).toBeFalsy();
    })
    test("false if on or more items placed in left of first item", () => {
      const items3 = [
        items[0],
        {
          topLeftInParent: {
            x: firstItem.width-1, 
            y: items[1].height,
          }
        },
        items[2],
      ]
      expect(shouldPlaceToHorizontal(items3)).toBeFalsy();
    })
  })
});
