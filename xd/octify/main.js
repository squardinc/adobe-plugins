const octify = (number) => Math.round(number / 8) * 8;


const { selection } = require("scenegraph");

let panel;


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

const shouldPlaceToHorizontal = (items) => {
  const itemOneRightBottom = {
    x: items[0].boundsInParent.x + items[0].boundsInParent.width,
    y: items[0].boundsInParent.y + items[0].boundsInParent.height,
  };
  return !items.find((item,idx) => {
    if(idx === 0) return false
    return (item.boundsInParent.y  > itemOneRightBottom.y ||
    item.boundsInParent.x < itemOneRightBottom.x )
  })
}

const shouldPlaceToVertical = (items) => {
  const itemOneRightBottom = {
    x: items[0].boundsInParent.x + items[0].boundsInParent.width,
    y: items[0].boundsInParent.y + items[0].boundsInParent.height,
  };
  return !items.find((item, idx) => {
    if(idx === 0) return false
    return (item.boundsInParent.y < itemOneRightBottom.y ||
      item.boundsInParent.x > itemOneRightBottom.x)
  })
};

const findTop = (items) => {
  let newItems = items.slice(0, items.length);
  
  newItems.sort(function (a, b) {
    return a.globalBounds.y - b.globalBounds.y;
  });
  return newItems;
};

const findLeft = (items) => {
  let newItems = items.slice(0, items.length);
  
  newItems.sort(function (a, b) {
    return a.globalBounds.x - b.globalBounds.x;
  });
  return newItems;
};

const octifyDifferenceFn = (selection) =>  {
  const { items } = selection;
              const itemsV = findTop(items);
              const itemsH = findLeft(items);

              if (items.length >= 2) {
            
                const centerX = items[0].topLeftInParent.x + (items[0].boundsInParent.width / 2);
                const centerY = items[0].topLeftInParent.y + (items[0].boundsInParent.height / 2);
            
                const itemOneRightBottom = {
                  x: items[0].topLeftInParent.x + items[0].boundsInParent.width,
                  y: items[0].topLeftInParent.y + items[0].boundsInParent.height,
                };
            
                if(shouldPlaceToHorizontal(itemsH)){
                  let totalDiffX = 0;
                  let moveDistance = 0;
            
                  for(let i = 1; i < items.length; i++){
                    let itemOne = itemsH[i - 1];
                    let itemTwo = itemsH[i];
            
                    const diffX = itemTwo.topLeftInParent.x - (itemOne.topLeftInParent.x + itemOne.boundsInParent.width);
            
                    totalDiffX += diffX;
                 }
                  const averageDiffX8 = octify(totalDiffX / ( items.length - 1 ));
            
            
                  for(let i = 1; i < itemsH.length; i++){
              
                    moveDistance += itemsH[i - 1].boundsInParent.width + Math.abs(averageDiffX8);

                    const moveCoordX = itemsH[0].translation.x + moveDistance;
                    const moveCoordY = centerY - Math.abs(itemsH[i].boundsInParent.height /2 );

                    itemsH[i].moveInParentCoordinates(moveCoordX - itemsH[i].boundsInParent.x, moveCoordY - itemsH[i].boundsInParent.y);
                  }
                } else if(shouldPlaceToVertical(itemsV)){
                  let totalDiffV = 0;
                  let moveDistance = 0;
            
                  for(let i = 1; i < itemsV.length; i++){
                    let itemOne = itemsV[i - 1];
                    let itemTwo = itemsV[i];
            
                    const diffV = itemTwo.topLeftInParent.y - (itemOne.topLeftInParent.y + itemOne.boundsInParent.height);
            
                    totalDiffV += diffV;
                 }
                  const averageDiffV8 = octify(totalDiffV / ( itemsV.length - 1 ));
            
            
                  for(let i = 1; i < itemsV.length; i++){
              
                    moveDistance += itemsV[i - 1].boundsInParent.height + Math.abs(averageDiffV8);

                    const moveCoordX = centerX - Math.abs(itemsV[i].boundsInParent.width / 2);
                    const moveCoordY = itemsV[0].boundsInParent.y + moveDistance;
            
                    itemsV[i].moveInParentCoordinates(moveCoordX - itemsV[i].boundsInParent.x, moveCoordY - itemsV[i].boundsInParent.y);
                  }
                } else{
                  return
                }
              }
};

function create() {
  const HTML =
      `<style>
          .break {
              flex-wrap: wrap;
          }
          label.row > span {
              color: #8E8E8E;
              width: 20px;
              text-align: right;
              font-size: 9px;
          }
          label.row input {
              flex: 1 1 auto;
          }
          .show {
              display: block;
          }
          .hide {
              display: none;
          }
      </style>
      <form class="automargin" method="dialog" id="automargin">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Auto</button>
          </footer>
      </form>
      <form class="autovertical" method="dialog" id="autovertical">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Vertical</button>
          </footer>
      </form>
      <form class="autohorizon" method="dialog" id="autohorizon">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Horizon</button>
          </footer>
      </form>
      <form class="increase" method="dialog" id="increase">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Plus</button>
          </footer>
      </form>
      <form class="decrease" method="dialog" id="decrease">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Minus</button>
          </footer>
      </form>
      `

      function autoMargin() {
          const { editDocument } = require("application");
          
          editDocument({ editLabel: "Auto margin"}, function (selection) {
          
              const { items } = selection;
              const itemsV = findTop(items);
              const itemsH = findLeft(items);

              if (items.length >= 2) {
            
                const centerX = items[0].topLeftInParent.x + (items[0].boundsInParent.width / 2);
                const centerY = items[0].topLeftInParent.y + (items[0].boundsInParent.height / 2);
            
                const itemOneRightBottom = {
                  x: items[0].topLeftInParent.x + items[0].boundsInParent.width,
                  y: items[0].topLeftInParent.y + items[0].boundsInParent.height,
                };
            
                if(shouldPlaceToHorizontal(itemsH)){
                  let totalDiffX = 0;
                  let moveDistance = 0;
            
                  for(let i = 1; i < items.length; i++){
                    let itemOne = itemsH[i - 1];
                    let itemTwo = itemsH[i];
            
                    const diffX = itemTwo.topLeftInParent.x - (itemOne.topLeftInParent.x + itemOne.boundsInParent.width);
            
                    totalDiffX += diffX;
                 }
                  const averageDiffX8 = octify(totalDiffX / ( items.length - 1 ));
            
            
                  for(let i = 1; i < itemsH.length; i++){
              
                    moveDistance += itemsH[i - 1].boundsInParent.width + Math.abs(averageDiffX8);

                    const moveCoordX = itemsH[0].translation.x + moveDistance;
                    const moveCoordY = centerY - Math.abs(itemsH[i].boundsInParent.height /2 );

                    itemsH[i].moveInParentCoordinates(moveCoordX - itemsH[i].boundsInParent.x, moveCoordY - itemsH[i].boundsInParent.y);
                  }
                } else if(shouldPlaceToVertical(itemsV)){
                  let totalDiffV = 0;
                  let moveDistance = 0;
            
                  for(let i = 1; i < itemsV.length; i++){
                    let itemOne = itemsV[i - 1];
                    let itemTwo = itemsV[i];
            
                    const diffV = itemTwo.topLeftInParent.y - (itemOne.topLeftInParent.y + itemOne.boundsInParent.height);
            
                    totalDiffV += diffV;
                 }
                  const averageDiffV8 = octify(totalDiffV / ( itemsV.length - 1 ));
            
            
                  for(let i = 1; i < itemsV.length; i++){
              
                    moveDistance += itemsV[i - 1].boundsInParent.height + Math.abs(averageDiffV8);

                    const moveCoordX = centerX - Math.abs(itemsV[i].boundsInParent.width / 2);
                    const moveCoordY = itemsV[0].boundsInParent.y + moveDistance;
            
                    itemsV[i].moveInParentCoordinates(moveCoordX - itemsV[i].boundsInParent.x, moveCoordY - itemsV[i].boundsInParent.y);
                  }
                } else{
                  return
                }
              }
          })
      }

  function autoVertical() {
    const { editDocument } = require("application");

    editDocument({ editLabel: "Line up vertical"}, function (selection) {
      const { items } = selection;
      const newItems = findTop(items);
      let moveDistance = 0;
      const centerX = newItems[0].boundsInParent.x + (newItems[0].boundsInParent.width / 2);  
      for(let i = 1; i < newItems.length; i++){
        moveDistance += newItems[i - 1].boundsInParent.height + 8;
        const moveCoordX = centerX - Math.abs(newItems[i].boundsInParent.width / 2);
        const moveCoordY = newItems[0].boundsInParent.y + moveDistance;

        newItems[i].moveInParentCoordinates(moveCoordX - newItems[i].boundsInParent.x, moveCoordY - newItems[i].boundsInParent.y);
  }
    })
  }

  function autoHorizon() {
    const { editDocument } = require("application");

    editDocument({ editLabel: "Line up vertical"}, function (selection) {
      const { items } = selection;
      const newItems = findLeft(items);
      let moveDistance = 0;
      const centerY = newItems[0].globalBounds.y + (newItems[0].globalBounds.height / 2);  
      for(let i = 1; i < newItems.length; i++){
        moveDistance += newItems[i - 1].globalBounds.width + 8;

        const moveCoordX = newItems[0].globalBounds.x + moveDistance;
        const moveCoordY = centerY - Math.abs(newItems[i].globalBounds.height / 2);

        newItems[i].moveInParentCoordinates(moveCoordX - newItems[i].globalBounds.x, moveCoordY - newItems[i].globalBounds.y);
  }
    })
  }

  function increaseMargin() {
    const { editDocument } = require("application");
    
    editDocument({ editLabel: "Decrease margin"}, function (selection) {
      const { items } = selection;
      const itemsV = findTop(items);
       const itemsH = findLeft(items);
      if(shouldPlaceToHorizontal(itemsH)){
        for(let i = 1; i < itemsH.length; i ++){
            const moveItem= itemsH[i];
            moveItem.translation = {x: moveItem.translation.x + 8 * i, y: moveItem.translation.y}
        }
      }else if(shouldPlaceToVertical(itemsV)){
        for(let i = 1; i < itemsV.length; i ++){
            const moveItem= itemsV[i];
            moveItem.translation = {x: moveItem.translation.x, y: moveItem.translation.y + 8 * i}
        }
      }else{
        return
      }
    });
};

  function decreaseMargin() {
      const { editDocument } = require("application");
      
      editDocument({ editLabel: "Decrease margin"}, function (selection) {
        const { items } = selection;
        const itemsV = findTop(items);
         const itemsH = findLeft(items);
        if(shouldPlaceToHorizontal(itemsH)){
          for(let i = 1; i < itemsH.length; i ++){
              const moveItem= itemsH[i];
              moveItem.translation = {x: moveItem.translation.x - 8 * i, y: moveItem.translation.y}
          }
        }else if(shouldPlaceToVertical(itemsV)){
          for(let i = 1; i < itemsV.length; i ++){
              const moveItem= itemsV[i];
              moveItem.translation = {x: moveItem.translation.x, y: moveItem.translation.y - 8 * i}
          }
        }else{
          return
        }
      });
  };

  panel = document.createElement("div");
  panel.innerHTML = HTML;

  panel.querySelector('#automargin').addEventListener("submit", autoMargin);
  panel.querySelector('#autovertical').addEventListener("submit", autoVertical);
  panel.querySelector('#autohorizon').addEventListener("submit", autoHorizon);
  panel.querySelector('#increase').addEventListener("submit", increaseMargin);
  panel.querySelector('#decrease').addEventListener("submit", decreaseMargin);

  return panel;
};

function show(event) {

  
  if (!panel) event.node.appendChild(create());

};



module.exports = {
  octify,
  shouldPlaceToHorizontal,
  shouldPlaceToVertical,
  findTop,
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyDiff: octifyDifferenceFn,
  },
  panels: {
    octifyMarginPanel: {
        show,
    }
  }
};