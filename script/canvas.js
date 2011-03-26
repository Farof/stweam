(function (exports) {
  
  exports.Canvas = function (node) {
    this.canvas = node;
    this.ctx = node.getContext('2d');
    
    this.buffers = [];
  };
  
  exports.Canvas.prototype = {
    maxSavedItems: 20,
    
    get buffer() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    
    set buffer(buffer) {
      this.ctx.putImageData(buffer, 0, 0);
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
        if (this.ctx.isPointInPath(options.mouseX, options.mouseY)) {
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
      } else  {
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
    
    path: function (options) {
      
    },
    
    circle: function (options) {
      var hover;
      
      this.beforeDraw(options);
      
      this.ctx.arc(options.x || 0, options.y || 0, options.r || 5, options.start || 0, options.end || (Math.PI * 2), false);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      hover = this.afterDraw(options);
      return hover;
    }
  };
  
}(window));