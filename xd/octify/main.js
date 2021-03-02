const octify = (number) => 
{
  if(number < 8)
  {return 8}
  else{return Math.round(number / 8) * 8;}
};


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
    x: items[0].globalBounds.x + items[0].globalBounds.width,
    y: items[0].globalBounds.y + items[0].globalBounds.height,
  };
  return !items.find((item,idx) => {
    if(idx === 0) return false
    return (item.globalBounds.y  > itemOneRightBottom.y ||
    item.globalBounds.x < itemOneRightBottom.x )
  })
}

const shouldPlaceToVertical = (items) => {
  const itemOneRightBottom = {
    x: items[0].globalBounds.x + items[0].globalBounds.width,
    y: items[0].globalBounds.y + items[0].globalBounds.height,
  };
  return !items.find((item, idx) => {
    if(idx === 0) return false
    return (item.globalBounds.y < itemOneRightBottom.y ||
      item.globalBounds.x > itemOneRightBottom.x)
  })
};

const adjustV = (items) => {
  // it line up items verticaly
  let newItems = items.slice(0, items.length);
  newItems.sort(function (a, b) {
    return a.globalBounds.y - b.globalBounds.y;
  });
  return newItems;
};

const adjustH = (items) => {
  // it line up items horizontally
  let newItems = items.slice(0, items.length);
  newItems.sort(function (a, b) {
    return a.globalBounds.x - b.globalBounds.x;
  });
  return newItems;
};

const makeMoveCoordX = (itemsH) => {
  // when you use autoMarginFn or autoMargin, if shouldPlaceToVertical == true, it makes coord to move items
  let totalMarginH = 0;
  let moveDistance = 0;
  let moveCoordArray = [];
  const centerY = itemsH[0].globalBounds.y + (itemsH[0].globalBounds.height / 2);

  for(let i = 1; i < itemsH.length; i++) {
    let itemOne = itemsH[i - 1];
    let itemTwo = itemsH[i];
    const MarginH = itemTwo.globalBounds.x - (itemOne.globalBounds.x + itemOne.globalBounds.width);
    totalMarginH += MarginH;
  }

  const averageMarginH8 = octify(totalMarginH / ( itemsH.length - 1 ));

  for(let i = 1; i < itemsH.length; i++){
    moveDistance += itemsH[i - 1].globalBounds.width + Math.abs(averageMarginH8);
    const moveCoordX = itemsH[0].globalBounds.x + moveDistance;
    const moveCoordY = centerY - Math.abs(itemsH[i].globalBounds.height /2 );

    moveCoordArray.push({x: moveCoordX, y: moveCoordY});
  };
  return moveCoordArray;
};

const makeMoveCoordY = (itemsV) => {
  // when you use autoMarginFn or autoMargin, if shouldPlaceToHorizon == true, it make Coord to move items
  let totalMarginV = 0;
  let moveDistance = 0;
  let moveCoordArray = [];
  const centerX = itemsV[0].globalBounds.x + (itemsV[0].globalBounds.width / 2);
  for(let i = 1; i < itemsV.length; i++) {
    let itemOne = itemsV[i - 1];
    let itemTwo = itemsV[i];
    const MarginV = itemTwo.globalBounds.y - (itemOne.globalBounds.y + itemOne.globalBounds.height);
    totalMarginV += MarginV;
  }
  const averageMarginV8 = octify(totalMarginV / ( itemsV.length - 1 ));
  for(let i = 1; i < itemsV.length; i++){
    moveDistance += itemsV[i - 1].globalBounds.height + Math.abs(averageMarginV8);
    const moveCoordX = centerX - Math.abs(itemsV[i].globalBounds.width / 2);
    const moveCoordY = itemsV[0].globalBounds.y + moveDistance;
    moveCoordArray.push({x: moveCoordX, y: moveCoordY});
  };
  return moveCoordArray;
};

const makeMoveCoordV = (itemsV) => {
  // when you use autoVertical, it makes coord to move items
      let moveDistance = 0;
      const centerX = itemsV[0].globalBounds.x + (itemsV[0].globalBounds.width / 2);  
      let moveCoordArray = [];
      for(let i = 1; i < itemsV.length; i++){
        moveDistance += itemsV[i - 1].globalBounds.height + 8;
        const moveCoordX = centerX - Math.abs(itemsV[i].globalBounds.width / 2);
        const moveCoordY = itemsV[0].globalBounds.y + moveDistance;
        moveCoordArray.push({x: moveCoordX, y: moveCoordY});
      };
      return moveCoordArray;
};

const makeMoveCoordH = (itemsH) => {
  // when you use autoHorizon, it makes coord to move items
  let moveDistance = 0;
  const centerY = itemsH[0].globalBounds.y + (itemsH[0].globalBounds.height / 2);  
  let moveCoordArray = [];
  for(let i = 1; i < itemsH.length; i++){
    moveDistance += itemsH[i - 1].globalBounds.width + 8;
    const moveCoordX = itemsH[0].globalBounds.x + moveDistance;
    const moveCoordY = centerY - Math.abs(itemsH[i].globalBounds.height / 2);
    moveCoordArray.push({x: moveCoordX, y: moveCoordY});
  };
  return moveCoordArray;
};



const autoMarginFn = (selection) =>  {
  const { items } = selection;
  const itemsV = adjustV(items);
  const itemsH = adjustH(items);
   
  if (items.length >= 2) {
    if(shouldPlaceToHorizontal(itemsH)){
      for(let i = 1; i < itemsH.length; i++){
        itemsH[i].moveInParentCoordinates(makeMoveCoordX(itemsH)[i - 1].x 
        - itemsH[i].globalBounds.x, makeMoveCoordX(itemsH)[i - 1].y - itemsH[i].globalBounds.y);
      }
    } else if(shouldPlaceToVertical(itemsV)){
      
      for(let i = 1; i < itemsV.length; i++){ 
        
        itemsV[i].moveInParentCoordinates(makeMoveCoordY(itemsV)[i - 1].x 
        - itemsV[i].globalBounds.x, makeMoveCoordY(itemsV)[i - 1].y - itemsV[i].globalBounds.y);
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
          const itemsV = adjustV(items);
          const itemsH = adjustH(items);
          if (items.length >= 2) {  
            if(shouldPlaceToHorizontal(itemsH)){
              for(let i = 1; i < itemsH.length; i++){
                itemsH[i].moveInParentCoordinates(makeMoveCoordX(itemsH)[i - 1].x 
                - itemsH[i].globalBounds.x, makeMoveCoordX(itemsH)[i - 1].y - itemsH[i].globalBounds.y);
              }
            } else if(shouldPlaceToVertical(itemsV)){
              for(let i = 1; i < itemsV.length; i++){ 
                itemsV[i].moveInParentCoordinates(makeMoveCoordY(itemsV)[i - 1].x 
                - itemsV[i].globalBounds.x, makeMoveCoordY(itemsV)[i - 1].y - itemsV[i].globalBounds.y);
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
      const itemsV = adjustV(selection.items);
      for(let i = 1; i < itemsV.length; i++){
        itemsV[i].moveInParentCoordinates(makeMoveCoordV(itemsV)[i -1].x - itemsV[i].globalBounds.x, makeMoveCoordV(itemsV)[i -1].y - itemsV[i].globalBounds.y);
  }
    })
  }

  function autoHorizon() {
    const { editDocument } = require("application");
    editDocument({ editLabel: "Line up vertical"}, function (selection) {
      const itemsH = adjustH(selection.items);
      for(let i = 1; i < itemsH.length; i++){
        itemsH[i].moveInParentCoordinates(makeMoveCoordH(itemsH)[i -1].x - itemsH[i].globalBounds.x, makeMoveCoordH(itemsH)[i -1].y - itemsH[i].globalBounds.y);
      }
    })
  }

  function increaseMargin() {
    const { editDocument } = require("application");
    
    editDocument({ editLabel: "Decrease margin"}, function (selection) {
      const { items } = selection;
      const itemsV = adjustV(items);
      const itemsH = adjustH(items);
      if(shouldPlaceToHorizontal(itemsH)){
        for(let i = 1; i < itemsH.length; i ++){
            const moveItem= itemsH[i];
            const moveCoordX = moveItem.globalBounds.x + 8 * i;
            moveItem.moveInParentCoordinates(moveCoordX - moveItem.globalBounds.x, 0);
        }
      }else if(shouldPlaceToVertical(itemsV)){
        for(let i = 1; i < itemsV.length; i ++){
            const moveItem= itemsV[i];
            const moveCoordY =  moveItem.globalBounds.y + 8 * i; 
            moveItem.moveInParentCoordinates(0, moveCoordY - moveItem.globalBounds.y);
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
        const itemsV = adjustV(items);
        const itemsH = adjustH(items);
        if(shouldPlaceToHorizontal(itemsH)){
          for(let i = 1; i < itemsH.length; i ++){
              const moveItem= itemsH[i];
              const moveCoordX = moveItem.globalBounds.x - 8 * i;
            　moveItem.moveInParentCoordinates(moveCoordX - moveItem.globalBounds.x, 0);
          }
        }else if(shouldPlaceToVertical(itemsV)){
          for(let i = 1; i < itemsV.length; i ++){
              const moveItem= itemsV[i];
              const moveCoordY =  moveItem.globalBounds.y - 8 * i; 
            　moveItem.moveInParentCoordinates(0, moveCoordY - moveItem.globalBounds.y);
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
  adjustV,
  adjustH,
  makeMoveCoordX,
  makeMoveCoordY,
  makeMoveCoordV,
  makeMoveCoordH,
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyMargin: autoMarginFn,
  },
  panels: {
    octifyMarginPanel: {
        show,
    }
  }
};