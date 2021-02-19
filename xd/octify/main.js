const { Rectangle } = require("scenegraph");

function octifyWidthFn(selection) {
  for (let i = 0; i < selection.items.length; i++) {
    let item = selection.items[i];
    if (item instanceof Rectangle) {
      item.width = Math.round(item.width / 8) * 8;
    }
  }
}
function octifyHeightFn(selection) {
  for (let i = 0; i < selection.items.length; i++) {
    let item = selection.items[i];
    if (item instanceof Rectangle) {
      item.height = Math.round(item.height / 8) * 8;
    }
  }
}

module.exports = {
  commands: {
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
  },
};
