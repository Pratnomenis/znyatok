export class ResizeCalculator {
    static fixMinusSize({
      newLeft,
      newTop,
      newWidth,
      newHeight
    }) {
      if (newWidth < 0) {
        newLeft += newWidth;
        newWidth *= -1;
      }
  
      if (newHeight < 0) {
        newTop += newHeight;
        newHeight *= -1;
      }
  
      return {
        newLeft,
        newTop,
        newWidth,
        newHeight
      }
    }
  
    static create(resizeName) {
      if (resizeName === 'top-left') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceX,
          distanceY
        }) => {
          let newLeft = canvasLeft + distanceX;
          let newTop = canvasTop + distanceY;
          let newWidth = canvasWidth - distanceX;
          let newHeight = canvasHeight - distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'top-middle') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceY
        }) => {
  
          let newLeft = canvasLeft;
          let newTop = canvasTop + distanceY;
          let newWidth = canvasWidth;
          let newHeight = canvasHeight - distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'top-right') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceX,
          distanceY
        }) => {
  
          let newLeft = canvasLeft;
          let newTop = canvasTop + distanceY;
          let newWidth = canvasWidth + distanceX;
          let newHeight = canvasHeight - distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'middle-right') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceX
        }) => {
  
          let newLeft = canvasLeft;
          let newTop = canvasTop;
          let newWidth = canvasWidth + distanceX;
          let newHeight = canvasHeight;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'bottom-right') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceX,
          distanceY
        }) => {
  
          let newLeft = canvasLeft;
          let newTop = canvasTop;
          let newWidth = canvasWidth + distanceX;
          let newHeight = canvasHeight + distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'bottom-middle') {
        return ({
          canvasHeight,
          canvasLeft,
          canvasTop,
          canvasWidth,
          distanceY
        }) => {
  
          let newLeft = canvasLeft;
          let newTop = canvasTop;
          let newWidth = canvasWidth;
          let newHeight = canvasHeight + distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'bottom-left') {
        return ({
          canvasLeft,
          canvasTop,
          canvasWidth,
          canvasHeight,
          distanceX,
          distanceY
        }) => {
  
          let newLeft = canvasLeft + distanceX;
          let newTop = canvasTop;
          let newWidth = canvasWidth - distanceX;
          let newHeight = canvasHeight + distanceY;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      if (resizeName === 'middle-left') {
        return ({
          canvasLeft,
          canvasTop,
          canvasWidth,
          canvasHeight,
          distanceX
        }) => {
  
          let newLeft = canvasLeft + distanceX;
          let newTop = canvasTop;
          let newWidth = canvasWidth - distanceX;
          let newHeight = canvasHeight;
  
          return ResizeCalculator.fixMinusSize({
            newLeft,
            newTop,
            newWidth,
            newHeight
          })
        }
      }
  
      return null
    }
  }