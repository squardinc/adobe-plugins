const octify = (number) => Math.round(number / 8) * 8;

const octifyFn = (selection) => {
  selection.items.forEach((item) => {
    const bounds = item.localBounds;
    item.resize(octify(bounds.width), octify(bounds.height));
  });
};

const octifyWidthFn = (selection) => {
  selection.items.forEach((item) => {
    const bounds = item.localBounds;
    item.resize(octify(bounds.width), bounds.height);
  });
};
const octifyHeightFn = (selection) => {
  selection.items.forEach((item) => {
    const bounds = item.localBounds;
    item.resize(bounds.width, octify(bounds.height));
  });
};

module.exports = {
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
  },
};
