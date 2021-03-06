(function (exports) {
  "use strict";
  
  exports.Drag = function (node, event, container, docWide) {
    this.node = node;
    this.event = event;
    this.container = container;
    this.moveContainer = docWide ? document : container;
    
    this.move = this.move.bind(this);
    this.stop = this.stop.bind(this);
    
    this.node.source.dragEvent = this;
    
    this.start();
  };
  
  exports.Drag.prototype = {
    constructor: exports.Drag,
    
    start: function () {
      var parent = this.node.parentNode;
      
      this.oriX = this.event.clientX;
      this.oriY = this.event.clientY;
      this.offsetX = this.node.offsetLeft;
      this.offsetY = this.node.offsetTop;
      
      parent.removeChild(this.node);
      parent.appendChild(this.node);
      
      this.moveContainer.addEventListener('mousemove', this.move, false);
      this.moveContainer.addEventListener('mouseup', this.stop, true);
      
      this.node.dragging = true;
      this.node.dragged = false;
    },
    
    move: function (event) {
      var
        item = this.node,
        style = item.style,
        left = (this.offsetX + (event.clientX - this.oriX)),
        top = (this.offsetY + (event.clientY - this.oriY)),
        maxWidth = this.container.width - item.scrollWidth,
        maxHeight = this.container.height - item.scrollHeight;
      
      this.moveEvent = event;
      
      if (left < 0) {
        left = 0;
      } else if (left > maxWidth) {
        left = maxWidth;
      }
      if (top < 0) {
        top = 0;
      } else if (top > maxHeight) {
        top = maxHeight;
      }
      
      style.position = 'absolute';
      style.left = left + 'px';
      style.top = top + 'px';
      item.source.dragPositionUpdated(left, top);
      
      if (!item.dragged) {
        item.dragged = true;
      }
    },
    
    stop: function () {
      this.moveContainer.removeEventListener('mousemove', this.move, false);
      this.moveContainer.removeEventListener('mouseup', this.stop, true);
      
      this.node.dragging = false;
      this.node.source.dragEvent = null;
      
      this.node.source.dragEnd(this);
    }
  };
  
  Drag.start = function (node, event, container, docWide) {
    return new Drag(node, event, container, docWide);
  };
}(window));