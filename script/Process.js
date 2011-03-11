(function (exports) {
  
  exports.Process = function Process(options) {
    for (var key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
    
    this.outputs = [];
    
    if (this.items) {
      this.items.forEach(function (item, index, ar) {
        // converting serialized items
        if (typeof item === 'string') {
          item = ar[index] = Twitter.deserialize(item);
          if (!item.process) {
            item.process = this;
          }
        }
        
        // registering process outputs
        if (item instanceof TweetOutput) {
          this.outputs.push(item);
        }
        
        // mapping inputs uids to objects
        if (typeof item.input === 'string') {
          item.input = this.items.filter(function (inputItem) {
            return inputItem.uid === item.input;
          })[0] || input;
        }
      }.bind(this))
    }
  };
  
  exports.Process.prototype = {
    constructor: exports.Process,
    
    serialize: function () {
      return {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        items: this.items.map(function (item) {
          return JSON.stringify(item.serialize());
        })
      };
    },
    
    name: 'unamed process',
    
    generate: function () {
      this.outputs.forEach(function (output) {
        output.generate();
      });
      return this;
    },
    
    toCollectionElement: function () {
      var el;
      if (!this.collectionElement) {
        el = new Element('p', {
          'class': 'collection-item process',
          text: this.name,
          events: {
            click: function () {
              console.log(this);
              this.loadInWorkspace();
            }.bind(this)
          }
        });
        
        this.collectionElement = el;
      }
      return this.collectionElement;
    },
    
    contains: function (itemToFind) {
      return this.items.filter(function (item) {
        return item === itemToFind;
      }).length === 1;
    },
    
    unloadFromWorkspace: function () {
      throw new Error('to implement');
      
      this.loaded = false;
      this.constructor.loadedItem = null;
      
      return this;
    },
    
    loadInWorkspace: function () {
      var workspace;
      
      if (!this.loaded) {
        workspace = document.getElementById('workspaceZone');
        if (workspace.process) {
          workspace.process.unloadFromWorkspace();
        }
        workspace.appendChild(this.toWorkspaceElement());
        this.drawCanvas();
        
        this.loaded = true;
        this.constructor.loadedItem = this;
      }
      
      return this;
    },
    
    toWorkspaceElement: function () {
      var el, htmlEl, canvasEl, i, ln;
      if (!this.workspaceZone) {
        this.workspaceZone = el = new Element('div', {
          id: 'workspace',
          process: this
        });
        this.workspace = htmlEl = new Element('div', {
          id: 'workHtml',
          process: this,
          events: {
            mousedown: this.handleWorkspaceMousedown
          }
        });
        el.appendChild(htmlEl);
        this.canvas = canvasEl = new Element('canvas', {
          id: 'workCanvas',
          height: '500',
          width: '600',
          process: this
        });
        el.appendChild(canvasEl);
        this.ctx = canvasEl.getContext('2d');
        
        this.items.forEach(function (item) {
          this.addToWorkspace(item);
        }.bind(this));
      }
      return this.workspaceZone;
    },
    
    addToWorkspace: function (item) {
      var el = item.toWorkspaceElement();
      this.workspace.appendChild(el);
      return this;
    },
    
    handleWorkspaceMousedown: function (event) {
      var item = event.target, strClasse = item.getAttribute('class'), classes = item.classList;
      if (!classes.contains('workspace-item-title-input') && strClasse && strClasse.indexOf('workspace-item-title') > -1) {
        this.process.startDrag(item.workspaceItem, event);
      }
    },
    
    _draggedItem: null,
    _dragOriX: null,
    _dragOriY: null,
    _dragOffsetX: null,
    _dragOffsetY: null,
    
    startDrag: function (item, event) {
      var parent = item.parentNode;
      this._draggedItem = item;
      this._dragOriX = event.clientX;
      this._dragOriY = event.clientY;
      this._dragOffsetX = item.offsetLeft;
      this._dragOffsetY = item.offsetTop;
      
      parent.removeChild(item);
      parent.appendChild(item);
      
      document.addEventListener('mousemove', this.doDrag, false);
      document.addEventListener('mouseup', this.stopDrag, true);
      
      item.dragging = true;
      item.dragged = false;
    },
    
    doDrag: function (event) {
      var
      workspace = document.getElementById('workspace'),
      process = workspace.process,
      draggedItem = process._draggedItem,
      style = draggedItem.style,
      left = (process._dragOffsetX + (event.clientX - process._dragOriX)),
      top = (process._dragOffsetY + (event.clientY - process._dragOriY)),
      canvas = process.canvas,
      maxWidth = canvas.width - draggedItem.scrollWidth,
      maxHeight = canvas.height - draggedItem.scrollHeight;
      
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
      draggedItem.source.position.left = left;
      draggedItem.source.position.top = top;
      style.position = 'absolute';
      style.left = left + 'px';
      style.top = top + 'px';
      process.drawCanvas();
      
      if (!draggedItem.dragged) {
        draggedItem.dragged = true;
      }
    },
    
    stopDrag: function (event) {
      var
      process = document.getElementById('workspace').process;
      
      document.removeEventListener('mousemove', process.doDrag, false);
      document.removeEventListener('mouseup', process.stopDrag, true);
      
      process._draggedItem.dragging = false;
      if (process._draggedItem.dragged) {
        process._draggedItem.querySelector('.workspace-item-title-zone').save();
      }
      
      Twitter.save(process);
    },
    
    clearCanvas: function () {
      this.canvas.width = this.canvas.width;
    },
    
    drawCanvas: function () {
      this.clearCanvas();
      this.drawPaths();
    },
    
    drawPaths: function () {
      this.items.forEach(function (item) {
        if (item.input) {
          this.drawPathBetween(item.input.workspaceElement, item.workspaceElement);
        }
      }.bind(this));
    },
    
    drawPathBetween: function (source, dest) {
      var
      ctx = this.ctx,
      
      dotRadius = 3,
      dotBorderWidth = 1,
      lineWidth = 2,
      arrowWidth = 5,
      arrowHeight = 7,
      
      sourceOnTop = source.offsetTop < dest.offsetTop,
      sourceOnLeft = source.offsetLeft < dest.offsetLeft,
      diffX = Math.abs(source.offsetLeft - dest.offsetLeft),
      diffY = Math.abs(source.offsetTop - dest.offsetTop),
      diffIsHeight = diffY > diffX,


      startX = source.offsetLeft + (diffIsHeight ? (source.scrollWidth / 2) : (sourceOnLeft ? source.scrollWidth : 0)),
      startY = source.offsetTop + (!diffIsHeight ? (source.scrollHeight / 2) : (sourceOnTop ? source.scrollHeight : 0)),
      startControlX = startX + (diffIsHeight ? 0 : (sourceOnLeft ? 50 : -50)),
      startControlY = startY + (!diffIsHeight ? 0 : (sourceOnTop ? 50 : -50))
      endX = dest.offsetLeft + (diffIsHeight ? (dest.scrollWidth / 2) : (!sourceOnLeft ? dest.scrollWidth : 0)),
      endY = dest.offsetTop + (!diffIsHeight ? (dest.scrollHeight / 2) : (!sourceOnTop ? dest.scrollHeight : 0)),
      endControlX = endX + (diffIsHeight ? 0 : (!sourceOnLeft ? 50 : -50)),
      endControlY = endY + (!diffIsHeight ? 0 : (!sourceOnTop ? 50 : -50)),
      arrowStartX = endX + (diffIsHeight ? -arrowWidth : (sourceOnLeft ? -arrowHeight : arrowHeight)),
      arrowStartY = endY + (!diffIsHeight ? -arrowWidth : (sourceOnTop ? -arrowHeight : arrowHeight)),
      arrowEndX = endX + (diffIsHeight ? arrowWidth : (sourceOnLeft ? -arrowHeight : arrowHeight)),
      arrowEndY = endY + (!diffIsHeight ? arrowWidth : (sourceOnTop ? -arrowHeight : arrowHeight));

      // start dot
      ctx.beginPath();
      ctx.arc(startX, startY, dotRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#3E3D40';
      ctx.fill();
      ctx.lineWidth = dotBorderWidth;
      ctx.strokeStyle = '#3E3D40';
      ctx.stroke();
      ctx.closePath();

      // line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startControlX, startControlY, endControlX, endControlY, endX, endY);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#3E3D40';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
      
      // end arrow
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(endX, endY);
      ctx.moveTo(endX, endY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.stroke();
      ctx.closePath();
    },
    
    itemUpdated: function (updateType, item) {
      Twitter.save(this);
    }
  };
  
  exports.Process.items = [];
  exports.Process.getById = function (uid) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.Process.getByItem = function (item) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].contains(item)) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.Process.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    document.getElementById('processes').appendChild(item.toCollectionElement());
    return item;
  };
  exports.Process.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));