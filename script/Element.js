(function (exports) {
  "use strict";
  
  exports.Element = function (tag, options) {
    var element = document.createElement(tag), key;
    
    for (key in options) {
      if (exports.Element.Mutators[key]) {
        exports.Element.Mutators[key].call(element, options[key]);
      } else if (['string', 'number'].indexOf(typeof options[key]) > -1) {
        element.setAttribute(key, options[key]);
      } else {
        element[key] = options[key];
      }
    }
    
    return element;
  };
  
  exports.Element.Mutators = {
    events: function (events) {
      var 
        event,
        func = function (func) {
          this.addEventListener(event, func, false);
        }.bind(this);
        
      for (event in events) {
        (Array.isArray(events[event]) ? events[event] : [events[event]]).forEach(func);
      }
    },
    
    text: function (text) {
      var textNode = document.createTextNode(text);
      this.appendChild(textNode);
    }
  };
  
  exports.Element.empty = function (node) {
    while (node.children[0]) {
      node.removeChild(node.children[0]);
    }
    return node;
  };
  
  exports.Element.pos = function (node, topParent) {
    var parent, coord = {
      x: node.offsetLeft,
      y: node.offsetTop
    };
    topParent = topParent || document;
    parent = node.offsetParent;
    
    while (parent && parent !== topParent) {
      coord.x += parent.offsetLeft;
      coord.y += parent.offsetTop;
      parent = parent.offsetParent;
    }
    
    return coord;
  };
  
  exports.Element.pointInside = function (node, x, y) {
    var pos = this.coordinate(node);
    return x >= pos.x && x <= (pos.x + node.scrollWidth) && y >= pos.y && y <= (pos.y + node.scrollHeight);
  };
  
  exports.Element.nodeInside = function (node, parent) {
    if (node === parent) {
      return true;
    }
    while (node) {
      if (node.parentNode === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };
  
  exports.Element.getParentByClass = function (node, name) {
    node = node.parentNode;
    while (node) {
      if (node.classList && node.classList.contains(name)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  
}(window));