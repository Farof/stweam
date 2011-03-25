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
      if (!options.samePath) {
        this.ctx.beginPath();
      }
      
      this.ctx.moveTo(options.startX, options.startY);
      this.ctx.lineTo(options.endX, options.endY);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      if (!options.pathContinues) {
        this.ctx.closePath();
      }
      return this;
    },
    
    path: function (options) {
      
    },
    
    circle: function (options) {
      if (!options.samePath) {
        this.ctx.beginPath();
      }
      
      this.ctx.arc(options.x || 0, options.y || 0, options.r || 5, options.start || 0, options.end || (Math.PI * 2), false);
      
      this.fill(options.fill);
      this.stroke(options.stroke);
      
      if (!options.pathContinues) {
        this.ctx.closePath();
      }
      return this;
    }
  };
  
}(window));