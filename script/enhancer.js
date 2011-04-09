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
        throw new Error('unimplemented');
      }
    },
    
    contains: {
      enumerable: true,
      value: function (node) {
        throw new Error('unimplemented');
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
    },
    
    pos: {
      enumerable: true,
      value: function (topParent) {
        var
          parent,
          node = this,
          coord = {
            left: node.offsetLeft,
            top: node.offsetTop
          };
        
        topParent = topParent || document;
        parent = node.offsetParent;

        while (parent && parent !== topParent) {
          coord.left += parent.offsetLeft;
          coord.top += parent.offsetTop;
          parent = parent.offsetParent;
        }
        
        coord.right = coord.left + node.scrollWidth;
        coord.centerX = coord.left + node.scrollWidth / 2;
        coord.bottom = coord.top + node.scrollHeight;
        coord.centerY = coord.top + node.scrollHeight / 2;

        return coord;
      }
    },
    
    hover: {
      enumerable: true,
      value: function (node) {
        var pos, nodePos;
        if (!node) {
          return false
        }
        pos = this.pos();
        nodePos = node.pos();
        return pos.centerX.between(nodePos.left, nodePos.right) && pos.centerY.between(nodePos.top, nodePos.bottom);
      }
    },
    
    dispose: {
      enumerable: true,
      value: function () {
        if (this.parentNode) {
          return this.parentNode.removeChild(this);
        }
        return false;
      }
    },
    
    empty: {
      enumerable: true,
      value: function () {
        while (this.children[0]) {
          this.removeChild(this.children[0]);
        }
        return this;
      }
    },
    
    getParentByClassName: {
      enumerable: true,
      value: function (name) {
        var node = this.parentNode;
        while (node) {
          if (node.classList && node.classList.contains(name)) {
            return node;
          }
          node = node.parentNode;
        }
        return null;
      }
    },
    
    hasChild: {
      enumerable: true,
      value: function (child) {
        var i, ln;
        for (i = 0, ln = this.children.length; i < ln; i += 1) {
          if (this.children[i] === child) {
            return true;
          }
        }
        return false;
      }
    },
    
    replaces: {
      enumerable: true,
      value: function (replaced) {
        if (replaced.parentNode) {
          replaced.parentNode.replaceChild(this, replaced);
        }
      }
    },
    
    scrollTo: {
      enumerable: true,
      value: function (child) {
        console.log('scroll');
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
  
  Object.defineProperties(Number.prototype, {
    between: {
      value: function (a, b) {
        if (a > b) {
          [a, b] = [b, a];
        }
        return this >= a && this <= b;
      }
    }
  });
  
  Object.defineProperties(Array.prototype, {
    last: {
      get: function () {
        return this[this.lenght - 1];
      }
    },
    
    contains: {
      value: function (item) {
        return this.indexOf(item) > -1;
      }
    },
    
    include: {
      value: function (item, pass) {
        if (!pass && Array.isArray(item)) {
          return this.merge(item);
        }
        if (!this.contains(item)) {
          this.push(item);
        }
        return this;
      }
    },
    
    merge: {
      value: function (items) {
        var i, ln;
        for (i = 0, ln = items.length; i < ln; i += 1) {
          this.include(items[i], true);
        }
        return this;
      }
    },
    
    remove: {
      value: function (item) {
        var i = this.indexOf(item);
        if (i > -1) {
          return this.splice(i, 1);
        }
        return null;
      }
    }
  });
  
  Object.defineProperties(Object.prototype, {
    map: {
      value: function (func) {
        var ar = [], key;
        for (key in this) {
          ar.push(func(this[key]));
        }
        return ar;
      }
    },
    
    typeOf: {
      value: function (type) {
        return typeof this === type;
      }
    }
  });
  
  Object.defineProperties(String.prototype, {
    htmlWrap: {
      value: function (tag, properties) {
        var str = ('<' + tag), key;
        
        for (key in properties) {
          str += ' ' + key + '="' + properties[key] + '"';
        }
        str += '>' + this + '</' + tag + '>';
        
        return str;
      }
    },
    
    contains: {
      value: function (str) {
        return this.indexOf(str) > -1;
      }
    }
  });
  
}(window));