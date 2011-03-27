(function (exports) {
  "use strict";
  
  exports.Canvas = function (node, tracker) {
    this.canvas = node;
    this.ctx = node.getContext('2d');
    
    this.buffers = [];
    this.trackMousemove(tracker);
  };
  
  exports.Canvas.prototype = {
    maxSavedItems: 20,
    
    trackMousemove: function (node) {
      this.mousemoveTrackNode = node || this.canvas;
      this.mousemoveTrackNode.addEventListener('mousemove', function (e) {
        var pos = Element.pos(this.canvas);
        this.mouseX = e.clientX - pos.x + document.documentElement.scrollLeft;
        this.mouseY = e.clientY - pos.y + document.documentElement.scrollTop;
      }.bind(this), false);
    },
    
    get buffer() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    
    set buffer(value) {
      this.ctx.putImageData(value, 0, 0);
    },
    
    save: function (buffer) {
      this.buffers.unshift(buffer || this.buffer);
      if (this.buffers.length > this.maxSavedItems) {
        this.buffers.pop();
      }
      return this;
    },
    
    load: function (index) {
      var buffer = this.buffers[index || 0];
      if (buffer) {
        try {
          this.ctx.putImageData(buffer, 0, 0);
          return true;
        } catch (e) {
          this.clear();
        }
      } else {
        this.clear();
      }
      return false;
    },
    
    loadBuffer: function (buffer) {
      this.buffer = buffer;
      return this;
    },
    
    clear: function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return this;
    },
    
    beforeDraw: function (options) {
      if (!options.samePath) {
        this.ctx.beginPath();
      }
    },
    
    afterDraw: function (options) {
      if (!options.pathContinues) {
        this.ctx.closePath();
        if (this.ctx.isPointInPath(this.mouseX, this.mouseY)) {
          return true;
        }
      }
      return false;
    },
    
    draw: function (queue) {
      var i, ln, hover = -1, options, ret;
      for (i = 0, ln = queue.length; i < ln; i += 1) {
        options = queue[i];
        ret = this[options.type](options);
        if (ret) {
          hover = i;
        }
      }
      return hover;
    },
    
    conf: function (options) {
      var key;
      if (typeof options === 'object') {
        for (key in options) {
          this.ctx[key] = options[key];
        }
      } else {
        return false;
      }
      return this;
    },
    
    fill: function (options) {
      if (this.conf(options)) {
        this.ctx.fill();
      }
      return this;
    },
    
    stroke: function (options) {
      if (this.conf(options)) {
        this.ctx.stroke();
      }
      return this;
    },
    
    line: function (options) {
      var hover;
      
      this.beforeDraw(options);
      
      this.ctx.moveTo(options.startX, options.startY);
      this.ctx.lineTo(options.endX, options.endY);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      hover = this.afterDraw(options);
      
      return hover;
    },
    
    bezier: function (options) {
      var hover;
      
      this.beforeDraw(options);
      
      this.ctx.moveTo(options.startX, options.startY);
      this.ctx.bezierCurveTo(options.startControlX, options.startControlY,
                              options.endControlX, options.endControlY,
                              options.endX, options.endY);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      hover = this.afterDraw(options);
      
      return hover;
    },
    
    path: function (options, parts) {
      var hover, i, ln, part;
      
      this.beforeDraw(options);
      
      for (i = 0, ln = parts.length; i < ln; i += 1) {
        part = parts[i];
        part.samePath = true;
        part.ontinues = true;
        this[part.type](part);
      }
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      hover = this.afterDraw(options);
      
      return hover;
    },
    
    circle: function (options) {
      var hover;
      
      this.beforeDraw(options);
      
      this.ctx.arc(options.x || 0, options.y || 0, options.r || 5, options.start || 0, options.end || (Math.PI * 2), false);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      hover = this.afterDraw(options);
      return hover;
    },
    
    arrow: function (options) {
      var alpha = Math.atan2(options.width / 2, Math.sqrt(Math.pow(options.radius, 2) - Math.pow(options.width / 2, 2))) + Math.PI;
      options.angle = options.angle || 0;
      return this.path(options, [{
        type: 'line',
        startX: options.x - options.radius * Math.sin(options.angle + alpha),
        startY: options.y - options.radius * Math.cos(options.angle + alpha),
        endX: options.x,
        endY: options.y
      }, {
        type: 'line',
        startX: options.x,
        startY: options.y,
        endX: options.x - options.radius * Math.sin(options.angle - alpha),
        endY: options.y - options.radius * Math.cos(options.angle - alpha)
      }]);
    }
  };
  
}(window));