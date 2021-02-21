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
    console.log(item)
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
const octifyDifferenceFn = (selection) => {
  const { items } = selection
  if(items.length === 2) {
    const itemOne = items[0]
    const itemTwo = items[1]
    const itemOneRightBottom = {x: itemOne.topLeftInParent.x + itemOne.width, y: itemOne.topLeftInParent.y + itemOne.height};
  
    if(itemOneRightBottom.y > itemTwo.topLeftInParent.y && itemOneRightBottom.x < itemTwo.topLeftInParent.x) {
      const diffX = itemTwo.topLeftInParent.x - (itemOne.topLeftInParent.x + itemOne.width);
      itemTwo.moveInParentCoordinates(octify(diffX) - diffX, 0);
    } 
    else if((itemOneRightBottom.y < itemTwo.topLeftInParent.y) && (itemOneRightBottom.x > itemTwo.topLeftInParent.x))
    {
      const diffY = itemTwo.topLeftInParent.y - (itemOne.topLeftInParent.y + itemOne.height);
      itemTwo.moveInParentCoordinates( 0, octify(diffY) - diffY);  
    } else {
    return
    }}
}

module.exports = {
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyDiff: octifyDifferenceFn

  },
};
