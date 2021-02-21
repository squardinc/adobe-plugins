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
  
  
  /** 
  const itemOne = selection.items[0]
  const itemTwo = selection.items[1]
  const diffX = (itemOne.topLeftInParent.x + itemOne.width) - itemTwo.topLeftInParent.x;
  itemOne.moveInParentCoordinates( octify(diffX) - diffX, 0); 
  */


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
const octifyDifferenceYFn = (selection) => {
  const itemOne = selection.items[0]
  const itemTwo = selection.items[1]
  const diffY = (itemOne.topLeftInParent.y + itemOne.height) - itemTwo.topLeftInParent.y;
  itemOne.moveInParentCoordinates( 0, octify(diffY) - diffY);  
}

module.exports = {
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyDiffY: octifyDifferenceYF

  },
};
