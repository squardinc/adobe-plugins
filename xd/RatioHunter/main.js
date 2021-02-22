const ratios = {
  cinemascope: 1 / 2.35,
  wide: 9 / 16,
  golden: 1 / 1.618,
  camera: 2 / 3,
  standard: 3 / 4,
  square: 1,
};
const ratioArray = Object.values(ratios);

const extract = (selection) => {
  const { items, focusedArtboard } = selection;
  if (!items.length) return {};
  const item = items[0];
  return {
    item,
    bounds: item.boundsInParent,
    width: focusedArtboard.width,
  };
};

const adjust = (base, ratio) => {
  return Math.round(base * ratio);
};

const toNextHeight = (height, width) => {
  const currentIndex = ratioArray.findIndex((ratio) => {
    return adjust(width, ratio) === Math.round(height);
  });
  if (currentIndex >= ratioArray.length - 1)
    return adjust(width, ratioArray[0]);
  return adjust(width, ratioArray[currentIndex + 1]);
};

const adjustWithRatio = (selection, ratio) => {
  const { item, bounds, width } = extract(selection);
  if (!item) return;
  item.moveInParentCoordinates(-bounds.x, 0);
  item.resize(width, adjust(width, ratio));
};

const hunt = (selection) => {
  const { item, bounds, width } = extract(selection);
  if (!item) return;
  item.moveInParentCoordinates(-bounds.x, 0);
  item.resize(width, toNextHeight(bounds.height, width));
};

module.exports = {
  ratioArray,
  adjust,
  toNextHeight,
  commands: {
    hunt,
    cinemascope: (selection) => adjustWithRatio(selection, ratios.cinemascope),
    wide: (selection) => adjustWithRatio(selection, ratios.wide),
    golden: (selection) => adjustWithRatio(selection, ratios.golden),
    camera: (selection) => adjustWithRatio(selection, ratios.camera),
    standard: (selection) => adjustWithRatio(selection, ratios.standard),
    square: (selection) => adjustWithRatio(selection, ratios.square),
  },
};
