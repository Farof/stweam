(function (exports) {
  "use strict";
  
  if (!Function.prototype.bind) {
    Object.defineProperty(Function.prototype, 'bind', {
      value: function (binded) {
        var args = arguments, func = this;
        return function () {
          return func.apply(binded, args);
        };
      }
    });
  }
  
  Object.defineProperties(HTMLElement.prototype, {
    offsetRight: {
      enumerable: true,
      get: function () {
        return this.offsetLeft + this.scrollWidth;
      }
    },
    
    offsetBottom: {
      enumerable: true,
      get: function () {
        return this.offsetTop + this.scrollHeight;
      }
    },
    
    centerX: {
      enumerable: true,
      get: function () {
        return this.offsetLeft + this.scrollWidth / 2;
      }
    },
    
    centerY: {
      enumerable: true,
      get: function () {
        return this.offsetTop + this.scrollHeight / 2;
      }
    },
    
    leftFrom: {
      enumerable: true,
      value: function (node) {
        return this.centerX < node.centerX;
      }
    },
    
    rightFrom: {
      enumerable: true,
      value: function (node) {
        return !this.leftFrom(node);
      }
    },
    
    above: {
      enumerable: true,
      value: function (node) {
        return this.centerY < node.centerY;
      }
    },
    
    under: {
      enumerable: true,
      value: function (node) {
        return !this.above(node);
      }
    },
    
    inside: {
      enumerable: true,
      value: function (node) {
        return node.contains(this);
      }
    },
    
    contains: {
      enumerable: true,
      value: function (node) {
        return node.centerX > this.offsetLeft && node.centerX < this.offsetRight && 
          node.centerY > this.offsetTop && node.centerY < this.offsetBottom;
      }
    },
    
    leftOverlapse: {
      enumerable: true,
      value: function (node, recurse) {
        return this.offsetLeft > node.offsetLeft &&
          this.offsetLeft < node.offsetRight &&
          (recurse ? true : (this.bottomOverlapse(node, true) || this.topOverlapse(node, true)));
      }
    },
    
    rightOverlapse: {
      enumerable: true,
      value: function (node, recurse) {
        return this.offsetRight > node.offsetLeft &&
          this.offsetRight < node.offsetRight &&
          (recurse ? true : (this.bottomOverlapse(node, true) || this.topOverlapse(node, true)));
      }
    },
    
    bottomOverlapse: {
      enumerable: true,
      value: function (node, recurse) {
        return this.offsetBottom > node.offsetTop &&
          this.offsetBottom < node.offsetBottom &&
          (recurse ? true : (this.leftOverlapse(node, true) || this.rightOverlapse(node, true)));
      }
    },
    
    topOverlapse: {
      enumerable: true,
      value: function (node, recurse) {
        return this.offsetTop > node.offsetTop &&
          this.offsetTop < node.offsetBottom &&
          (recurse ? true : (this.leftOverlapse(node, true) || this.rightOverlapse(node, true)));
      }
    },
    
    overlapse: {
      enumerable: true,
      value: function (node) {
        return this.topOverlapse(node) || this.rightOverlapse(node) || this.bottomOverlapse(node) || this.rightOverlapse(node);
      }
    },
    
    getDiffX: {
      enumerable: true,
      value: function (node) {
        return Math.abs(this.centerX - node.centerX);
      }
    },
    
    getDiffY: {
      enumerable: true,
      value: function (node) {
        return Math.abs(this.centerY - node.centerY);
      }
    },
    
    distIsWidth: {
      enumerable: true,
      value: function (node) {
        return !this.distIsHeight(node);
      }
    },
    
    distIsHeight: {
      enumerable: true,
      value: function (node) {
        return this.getDiffX(node) < this.getDiffY(node);
      }
    },
    
    getAttachXFor: {
      enumerable: true,
      value: function (node) {
        return this.offsetLeft + (this.distIsHeight(node) ? (this.scrollWidth / 2) : (this.leftFrom(node) ? this.scrollWidth : 0));
      }
    },
    
    getAttachXControlFor: {
      enumerable: true,
      value: function (node, startX) {
        return startX + (this.distIsHeight(node) ? (this.getDiffX(node) * 0.1 * (this.leftFrom(node) ? 1 : -1)) : (this.leftFrom(node) ? 50 : -50));
      }
    },
    
    getAttachYFor: {
      enumerable: true,
      value: function (node) {
        return this.offsetTop + (!this.distIsHeight(node) ? (this.scrollHeight / 2) : (this.above(node) ? this.scrollHeight : 0));
      }
    },
    
    getAttachYControlFor: {
      enumerable: true,
      value: function (node, startY) {
        return startY + (!this.distIsHeight(node) ? (this.getDiffY(node) * 0.1 * (this.above(node) ? 1 : -1)) : (this.above(node) ? 50 : -50));
      }
    }
  });
  
  Object.defineProperties(Event.prototype, {
    stop: {
      enumerable: true,
      value: function () {
        this.stopPropagation();
        this.preventDefault();
      }
    }
  });
  
}(window));