const { describe, test, expect } = require("@jest/globals");
const { octify ,shouldPlaceToHorizontal, shouldPlaceToVertical, adjustV, adjustH, makeMoveCoordX, makeMoveCoordY} = require("/Users/yuuki/Library/Application Support/Adobe/Adobe XD/develop/octify/main.js");

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
      globalBounds: {
        x: 0,
        y: 0,
        width: 10,
        height:20,
      }
    }

    const items = [
      firstItem,
      {
        globalBounds: {
          x: firstItem.globalBounds.width + 1,
          y: firstItem.globalBounds.height-1,
        },
      },
      {
        globalBounds: {
          x: firstItem.globalBounds.width + 0.1,
          y: firstItem.globalBounds.height-0.1,
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
          globalBounds: {
            x: items[0].globalBounds.x, 
            y: firstItem.globalBounds.height+1,
          }
        },
        items[2],
      ]
      expect(shouldPlaceToHorizontal(items2)).toBeFalsy();
    })
    test("false if one or more items placed in left of first item", () => {
      const items3 = [
        items[0],
        {
          globalBounds: {
            x: firstItem.globalBounds.width-1, 
            y: items[1].globalBounds.height,
          }
        },
        items[2],
      ]
      expect(shouldPlaceToHorizontal(items3)).toBeFalsy();
    })
  })

  describe("shouldPlaceToVertical", () => {
    const firstItem = {
      globalBounds: {
        x: 0,
        y: 0,
        width: 10,
        height:20,
      }
    }

    const items = [
      firstItem,
      {
        globalBounds: {
          x: firstItem.globalBounds.width - 1,
          y: firstItem.globalBounds.height + 1,
        },
      },
      {
        globalBounds: {
          x: firstItem.globalBounds.width - 0.1,
          y: firstItem.globalBounds.height + 0.1,
        },
      }
    ]
    test("true if no items placed in right of first item", () => {
      expect(shouldPlaceToVertical(items)).toBeTruthy();
    })
    test("false if one or more items placed in right of first item", () => {
      const items2 = [
        items[0],
        {
          globalBounds: {
            x: firstItem.globalBounds.width + 1,
            y: items[1].globalBounds.y,
          }
        },
        items[2],
      ]
      expect(shouldPlaceToVertical(items2)).toBeFalsy();
    })
    test("false if one or more items placed in above of first item", () => {
      const items3 = [
        items[0],
        {
          globalBounds: {
            x: items[1].globalBounds.width,
            y: firstItem.globalBounds.height - 1
          }
        },
        items[2],
      ]
      expect(shouldPlaceToVertical(items3)).toBeFalsy();
    })
  })

  describe("adjustV", () => {
    const firstItem = {
      globalBounds: {
        x: 0,
        y: 0,
      }
    };
    test(" whether it arrange correctly, when in reverse order ", () => {
      const trueItems = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 3,
          }
        },
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 5,
          }
        },
      ]
      const items = [
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 5,
          }
        },
        {
            globalBounds: {
              x: firstItem.globalBounds.x,
              y: firstItem.globalBounds.y + 3
          }
        },
          firstItem   
      ]
      expect(adjustV(items)).toEqual( trueItems );
    })
    test(" whether it arrange correctly, when one item's x is laeger than lead item's x", () => {
      const trueItems2 = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 1,
            y: firstItem.globalBounds.y + 3,
          }
        },
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 5,
          }
        },
      ]
      const items2 = [
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 5,
          }
        },
        {
          globalBounds: 
          {
            x: firstItem.globalBounds.x + 1,
            y: firstItem.globalBounds.y + 3,
          }
        },
        firstItem
      ]
      expect(adjustV(items2)).toEqual( trueItems2 );
    })
    
  })

  describe("adjustH", () => {
    const firstItem = {
      globalBounds: {
        x: 0,
        y: 0,
      }
    };
    test(" whether it arrange correctly, when in reverse order ", () => {
      const trueItems = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 3,
            y: firstItem.globalBounds.y,
          }
        },
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 5,
            y: firstItem.globalBounds.y,
          }
        },
      ]
      const items = [
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 5,
            y: firstItem.globalBounds.y,
          }
        },
        {
            globalBounds: {
              x: firstItem.globalBounds.x + 3,
              y: firstItem.globalBounds.y
          }
        },
          firstItem   
      ]
      expect(adjustH(items)).toEqual( trueItems );
    })
    test(" whether it arrange correctly, when one item's x is laeger than lead item's x", () => {
      const trueItems2 = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 3,
            y: firstItem.globalBounds.y + 1,
          }
        },
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 5,
            y: firstItem.globalBounds.y,
          }
        },
      ]
      const items2 = [
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 5,
            y: firstItem.globalBounds.y,
          }
        },
        {
          globalBounds: 
          {
            x: firstItem.globalBounds.x + 3,
            y: firstItem.globalBounds.y + 1,
          }
        },
        firstItem
      ]
      expect(adjustH(items2)).toEqual( trueItems2 );
    })
    
  })

  describe("makeMoveCoordX", () => {
    const firstItem = {
      globalBounds: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      }
    };
    test(" 正しく移動さきのポジションが作れているか（横）", () => {
      const trueArray = [
        {x: 18, y: -5},
        {x: 46, y: -10},
      ]
      const Item = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x + 15,
            y: firstItem.globalBounds.y,
            width: firstItem.globalBounds.width + 10,
            height: firstItem.globalBounds.height + 10,
          }
        },
        {
          globalBounds: {
          x: firstItem.globalBounds.x + 45,
          y: firstItem.globalBounds.y,
          width: firstItem.globalBounds.width + 20,
          height: firstItem.globalBounds.height + 20,
          }
        }
      ]
      expect(makeMoveCoordX(Item)).toEqual( trueArray );
    })
  })
  
  describe("makeMoveCoordY", () => {
    const firstItem = {
      globalBounds: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      }
    };
    test(" 正しく移動さきのポジションが作れているか(縦)", () => {
      const trueArray = [
        {x: -5, y: 18},
        {x: -10, y: 46},
      ]
      const Item = [
        firstItem,
        {
          globalBounds: {
            x: firstItem.globalBounds.x,
            y: firstItem.globalBounds.y + 15,
            width: firstItem.globalBounds.width + 10,
            height: firstItem.globalBounds.height + 10,
          }
        },
        {
          globalBounds: {
          x: firstItem.globalBounds.x,
          y: firstItem.globalBounds.y + 45,
          width: firstItem.globalBounds.width + 20,
          height: firstItem.globalBounds.height + 20,
          }
        }
      ]
      expect(makeMoveCoordY(Item)).toEqual( trueArray );
    })
  })
});
