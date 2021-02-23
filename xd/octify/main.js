const octify = (number) => Math.round(number / 8) * 8;

const octifyCeil = (number) => Math.ceil(number / 8) * 8;
const octifyFloor = (number) => Math.floor(number / 8) * 8;


const octifyFn = (selection) => {
  const { items } = selection;
  if (items.length === 0) return;
  if (items.length === 1) {
    const item = items[0];
    const bounds = item.boundsInParent;
    item.resize(octify(bounds.width), octify(bounds.height));
    return;
  }

  items.forEach((item) => {
    console.log(item);
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
  const { items } = selection;
  if (items.length === 2) {
    const itemOne = items[0];
    const itemTwo = items[1];
    
    const itemOneRightBottom = {
      x: itemOne.topLeftInParent.x + itemOne.width,
      y: itemOne.topLeftInParent.y + itemOne.height,
    };

    if (
      itemOneRightBottom.y > itemTwo.topLeftInParent.y &&
      itemOneRightBottom.x < itemTwo.topLeftInParent.x
    ) {
      const diffX =
        itemTwo.topLeftInParent.x - (itemOne.topLeftInParent.x + itemOne.width);
      itemTwo.moveInParentCoordinates(octify(diffX) - diffX, 0);
    } else if (
      itemOneRightBottom.y < itemTwo.topLeftInParent.y &&
      itemOneRightBottom.x > itemTwo.topLeftInParent.x
    ) {
      const diffY =
        itemTwo.topLeftInParent.y -
        (itemOne.topLeftInParent.y + itemOne.height);
      itemTwo.moveInParentCoordinates(0, octify(diffY) - diffY);
    } else {
      return;
    }
  }
};

const shouldPlaceToHorizontal = (items) => {
  const itemOneRightBottom = {
    x: items[0].topLeftInParent.x + items[0].width,
    y: items[0].topLeftInParent.y + items[0].height,
  };
  return !items.find((item,idx) => {
    if(idx === 0) return false
    return (item.topLeftInParent.y  > itemOneRightBottom.y ||
    item.topLeftInParent.x < itemOneRightBottom.x )
  })
}
const test = (selection) =>  {
  const { items } = selection;
  if (items.length >= 2) {

    let checkV = false;

    const centerX = items[0].topLeftInParent.x + (items[0].width / 2);
    const centerY = items[0].topLeftInParent.y + (items[0].height / 2);

    const itemOneRightBottom = {
      x: items[0].topLeftInParent.x + items[0].width,
      y: items[0].topLeftInParent.y + items[0].height,
    };

    for(let i = 1; i < items.length; i ++) {
      if(
        itemOneRightBottom.y < items[i].topLeftInParent.y &&
        itemOneRightBottom.x > items[i].topLeftInParent.x
      ){
        checkV = true;
      }else {
        checkV = false;
        break;
      }
    }

    if(shouldPlaceToHorizontal(items)){
      let totalDiffX = 0;
      let moveDistance = 0;

      for(let i = 1; i < items.length; i++){
        let itemOne = items[i - 1];
        let itemTwo = items[i];

        const diffX = itemTwo.topLeftInParent.x - (itemOne.topLeftInParent.x + itemOne.width);

        totalDiffX += diffX;
     }
      const averageDiffX8 = octify(totalDiffX / ( items.length - 1 ));


      for(let i = 1; i < items.length; i++){
  
        moveDistance += items[i - 1].width + Math.abs(averageDiffX8);

        items[i].translation = {x: items[0].translation.x + moveDistance, y: centerY - Math.abs(items[i].height /2 )}
      }
    } else if(checkV == true){
      let totalDiffV = 0;
      let moveDistance = 0;

      for(let i = 1; i < items.length; i++){
        let itemOne = items[i - 1];
        let itemTwo = items[i];

        const diffV = itemTwo.topLeftInParent.y - (itemOne.topLeftInParent.y + itemOne.height);

        totalDiffV += diffV;
     }
      const averageDiffV8 = octify(totalDiffV / ( items.length - 1 ));


      for(let i = 1; i < items.length; i++){
  
        moveDistance += items[i - 1].height + Math.abs(averageDiffV8);

        items[i].translation = {x: centerX - Math.abs(items[i].width / 2), y: items[0].translation.y + moveDistance}
      }
    } else{
      console.log("縦にも横にも並んでいない");
      return
    }
  }
};



module.exports = {
  octify,
  shouldPlaceToHorizontal,
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyDiff: octifyDifferenceFn,
    test: test,
  },
};
