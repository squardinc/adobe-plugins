const octify = (number) => Math.round(number / 8) * 8;

const octifyFn = (selection) => {
  const { items } = selection
  if(items.length === 0) return
  if(items.length === 1) {
    const item = items[0]
    const bounds = item.boundsInParent;
    item.resize(octify(bounds.width), octify(bounds.height));
    return
  }
  items.forEach((item) => {
    console.log('2')
  });
};

const octifyWidthFn = (selection) => {
  selection.items.forEach((item) => {
    const bounds = item.boundsInParent;
    item.resize(octify(bounds.width), bounds.height);
  });
};
const octifyHeightFn = (selection) => {
  selection.items.forEach((item) => {
    const bounds = item.boundsInParent;
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
