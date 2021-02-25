const octify = (number) => Math.round(number / 8) * 8;


const { selection } = require("scenegraph")
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
    x: items[0].topLeftInParent.x + items[0].width,
    y: items[0].topLeftInParent.y + items[0].height,
  };
  return !items.find((item,idx) => {
    if(idx === 0) return false
    return (item.topLeftInParent.y  > itemOneRightBottom.y ||
    item.topLeftInParent.x < itemOneRightBottom.x )
  })
}

const shouldPlaceToVertical = (items) => {
  const itemOneRightBottom = {
    x: items[0].topLeftInParent.x + items[0].width,
    y: items[0].topLeftInParent.y + items[0].height,
  };
  return !items.find((item, idx) => {
    if(idx === 0) return false
    return (item.topLeftInParent.y < itemOneRightBottom.y ||
      item.topLeftInParent.x > itemOneRightBottom.x)
  })
}

const octifyDifferenceFn = (selection) =>  {
  const { items } = selection;
  if (items.length >= 2) {

    const centerX = items[0].topLeftInParent.x + (items[0].width / 2);
    const centerY = items[0].topLeftInParent.y + (items[0].height / 2);

    const itemOneRightBottom = {
      x: items[0].topLeftInParent.x + items[0].width,
      y: items[0].topLeftInParent.y + items[0].height,
    };

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
    } else if(shouldPlaceToVertical(items)){
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
      <form class="automargin" method="dialog" id="main">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Auto</button>
          </footer>
      </form>
      <form class="autovertical" method="dialog" id="main">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Vertical</button>
          </footer>
      </form>
      <form class="autohorizon" method="dialog" id="main">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Horizon</button>
          </footer>
      </form>
      <form class="increase" method="dialog" id="main">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Plus</button>
          </footer>
      </form>
      <form class="decrease" method="dialog" id="main">
          <footer>
            <button id="ok" type="submit" uxp-variant="cta">Minus</button>
          </footer>
      </form>
      <p id="warning">This plugin requires you to select a rectangle in the document. Please select a rectangle.</p>
      `

  

      function autoMargin() {
          const { editDocument } = require("application");
          
          editDocument({ editLabel: "Auto margin"}, function (selection) {
          
              const { items } = selection;
              if (items.length >= 2) {
            
                const centerX = items[0].topLeftInParent.x + (items[0].width / 2);
                const centerY = items[0].topLeftInParent.y + (items[0].height / 2);
            
                const itemOneRightBottom = {
                  x: items[0].topLeftInParent.x + items[0].width,
                  y: items[0].topLeftInParent.y + items[0].height,
                };
            
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
                } else if(shouldPlaceToVertical(items)){
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
          })
      }

  function autoVertical() {
    const { editDocument } = require("application");

    editDocument({ editLabel: "Line up vertical"}, function (selection) {
      const { items } = selection;
      let moveDistance = 0;
      const centerX = items[0].topLeftInParent.x + (items[0].width / 2);
      const centerY = items[0].topLeftInParent.y + (items[0].height / 2);

      for(let i = 1; i < items.length; i++){
        moveDistance += items[i - 1].height + 8;

        items[i].translation = {x: centerX - Math.abs(items[i].width / 2), y: items[0].translation.y + moveDistance}
  }
    })
  }

  function autoHorizon() {
    const { editDocument } = require("application");

    editDocument({ editLabel: "Line up horizon"}, function (selection) {
      const { items } = selection;
      let moveDistance = 0;
      const centerY = items[0].topLeftInParent.y + (items[0].height / 2);

      for(let i = 1; i < items.length; i++){
        moveDistance += items[i - 1].width + 8;

        items[i].translation = {x: items[0].translation.x + moveDistance, y: centerY - Math.abs(items[i].height / 2)}
  }
    })
  }
  
  

  function increaseMargin() {
    const { editDocument } = require("application");
    
    editDocument({ editLabel: "Increase margin"}, function (selection) {
      const { items } = selection;
      if(shouldPlaceToHorizontal(items)){
        for(let i = 1; i < items.length; i ++){
            const moveItem= items[i];
            moveItem.translation = {x: moveItem.translation.x + 8 * i, y: moveItem.translation.y}
        }
      }else if(shouldPlaceToVertical(items)){
        for(let i = 1; i < items.length; i ++){
            const moveItem= items[i];
            moveItem.translation = {x: moveItem.translation.x, y: moveItem.translation.y + 8 * i}
        }
      }else{
        return
      }

    })
  };

  function decreaseMargin() {
      const { editDocument } = require("application");
      
      editDocument({ editLabel: "Decrease margin"}, function (selection) {
        const { items } = selection;
        if(shouldPlaceToHorizontal(items)){
          for(let i = 1; i < items.length; i ++){
              const moveItem= items[i];
              moveItem.translation = {x: moveItem.translation.x - 8 * i, y: moveItem.translation.y}
          }
        }else if(shouldPlaceToVertical(items)){
          for(let i = 1; i < items.length; i ++){
              const moveItem= items[i];
              moveItem.translation = {x: moveItem.translation.x, y: moveItem.translation.y - 8 * i}
          }
        }else{
          return
        }
      })
  }

  

  panel = document.createElement("div");
  panel.innerHTML = HTML;


  panel.querySelector('.automargin').addEventListener("submit", autoMargin);
  panel.querySelector('.autovertical').addEventListener("submit", autoVertical);
  panel.querySelector('.autohorizon').addEventListener("submit", autoHorizon);
  panel.querySelector('.increase').addEventListener("submit", increaseMargin);
  panel.querySelector('.decrease').addEventListener("submit", decreaseMargin);


  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

function update() {
  const { Rectangle } = require("scenegraph");

  let formAuto = document.querySelector('.automargin');
  let formVer = document.querySelector('.autovertical');
  let formHor = document.querySelector('.autohorizon');
  let formInc = document.querySelector('.increase');
  let formDec = document.querySelector('.decrease');
  let warning = document.querySelector("#warning");
  if (!selection || !(selection.items[0] instanceof Rectangle)) {
      formAuto.className = "hide";
      formVer.className = "hide";
      formHor.className = "hide";
      formInc.className = "hide";
      formDec.className = "hide";
      warning.className = "show";
  } else {
      formAuto.className = "show";
      formVer.className = "show";
      formHor.className = "show";
      formInc.className = "show";
      formDec.className = "show";
      warning.className = "hide";
  }
}

module.exports = {
  octify,
  shouldPlaceToHorizontal,
  shouldPlaceToVertical,
  commands: {
    octify: octifyFn,
    octifyWidth: octifyWidthFn,
    octifyHeight: octifyHeightFn,
    octifyDiff: octifyDifferenceFn,
  },
  /**パネル追加ここから */
  panels: {
    octifyMarginPanel: {
        show,
        update
    }
  }
  /**パネル追加ここまで */
};
