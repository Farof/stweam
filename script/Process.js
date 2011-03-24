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
    
    canvasStatus: {
      overItem: null,
      overPath: {},
      mouseX: null,
      mouseY: null
    },
    
    toWorkspaceElement: function () {
      var el, htmlEl, canvasEl, i, ln;
      if (!this.workspaceZone) {
        this.workspaceZone = el = new Element('div', {
          id: 'workspace',
          process: this,
          events: {
            mousedown: function (e) {
              this.process.handleWorkspaceMousedown.call(htmlEl, e);
            },
            
            mouseover: function (e) {
              var target = e.target;
            },
            
            mousemove: function (e) {
              var
              target = e.target,
              process = this.process,
              pos = Element.pos(process.canvas),
              item = target.classList.contains('workspace-item') ? target : Element.getParentByClass(target, 'workspace-item');
              
              if ((!process.canvasStatus.overItem && item) ||
                  (process.canvasStatus.overItem && item && process.canvasStatus.overItem != item)) {
                process.canvasStatus.overItem = item;
              } else if (process.canvasStatus.overItem && !item) {
                process.canvasStatus.overItem = null;
              }
              
              process.canvasStatus.mouseX = e.clientX - pos.x + document.documentElement.scrollLeft;
              process.canvasStatus.mouseY = e.clientY - pos.y + document.documentElement.scrollTop;
              process.drawCanvas(e);
            },
            
            click: function (e) {
              var pos = Element.pos(canvasEl);
              console.log('( ' + (e.clientX - pos.x) + ' ; ' + (e.clientY - pos.y) + ' )', e);
            }
          }
        });
        this.workspace = htmlEl = new Element('div', {
          id: 'workHtml',
          process: this
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
    
    canvasConf: {
      mouse: {
        circle: {
          radius: { normal: 5 },
          borderWidth: { normal: 1 },
          borderColor: { normal: '#3E3D40' }
        }
      },
      itemPath: {
        dot: {
          radius: { normal: 3, overSource: 5 },
          borderWidth: { normal: 1, overSource: 2 },
          fillColor: { normal: '#3E3D40', overSource: '#FF0000' },
          borderColor: { normal: '#3E3D40', get overSource() { return this.normal; } }
        },
        line: {
          width: { normal: 2, over: 3 },
          color: { normal: '#3E3D40', get over() { return this.normal; } },
          shadowColor: { normal: '#3E3D40', over: '#FF0000' },
          shadowBlur: { normal: 0, over: 2 }
        },
        arrow: {
          width: { normal: 5 },
          height: { normal: 7 },
          color: { normal: '#3E3D40' }
        }
      }
    },
    
    drawCanvas: function () {
      this.clearCanvas();
      this.drawPaths();
      this.drawMouse();
      
      if (this.canvasStatus.redraw === true) {
        this.canvasStatus.redraw = false;
        this.drawCanvas();
        this.canvasStatus.redraw = null;
      }
    },
    
    setRedraw: function () {
      this.canvasStatus.redraw = (this.canvasStatus.redraw !== false) ? true : false;
    },
    
    drawMouse: function () {
      var
      ctx = this.ctx,
      conf = this.canvasConf.mouse,
      status = this.canvasStatus;
      
      ctx.beginPath();
      ctx.arc(status.mouseX, status.mouseY, conf.circle.radius.normal, 0, 2 * Math.PI, false);
      ctx.lineWidth = conf.circle.borderWidth.normal;
      ctx.strokeStyle = conf.circle.borderColor.normal;
      ctx.stroke();
      ctx.closePath();
    },
    
    drawPaths: function (e) {
      this.items.forEach(function (item) {
        if (item.input) {
          this.drawPathBetween(item.input.workspaceElement, item.workspaceElement, e);
        }
      }.bind(this));
    },
    
    drawPathBetween: function (source, dest, e) {
      var
      ctx = this.ctx,
      
      // path conf
      status = this.canvasStatus,
      conf = this.canvasConf.itemPath,
      overSource = status.overItem === source,
      overPath = status.overPath && status.overPath.source === source && status.overPath.dest === dest,
      
      // positions infos
      sourceCenterX = source.offsetLeft + (source.scrollWidth / 2),
      sourceCenterY = source.offsetTop + (source.scrollHeight / 2),
      destCenterX = dest.offsetLeft + (dest.scrollWidth / 2),
      destCenterY = dest.offsetTop + (dest.scrollHeight / 2),
      sourceOnLeft = sourceCenterX < destCenterX,
      sourceOnTop = sourceCenterY < destCenterY,
      diffX = Math.abs(sourceCenterX - destCenterX),
      diffY = Math.abs(sourceCenterY - destCenterY),
      diffIsHeight = diffY > diffX,

      // coordinates
      startX = source.offsetLeft + (diffIsHeight ? (source.scrollWidth / 2) : (sourceOnLeft ? source.scrollWidth : 0)),
      startY = source.offsetTop + (!diffIsHeight ? (source.scrollHeight / 2) : (sourceOnTop ? source.scrollHeight : 0)),
      startControlX = startX + (diffIsHeight ? 0 : (sourceOnLeft ? 50 : -50)),
      startControlY = startY + (!diffIsHeight ? 0 : (sourceOnTop ? 50 : -50))
      endX = dest.offsetLeft + (diffIsHeight ? (dest.scrollWidth / 2) : (!sourceOnLeft ? dest.scrollWidth : 0)),
      endY = dest.offsetTop + (!diffIsHeight ? (dest.scrollHeight / 2) : (!sourceOnTop ? dest.scrollHeight : 0)),
      endControlX = endX + (diffIsHeight ? 0 : (!sourceOnLeft ? 50 : -50)),
      endControlY = endY + (!diffIsHeight ? 0 : (!sourceOnTop ? 50 : -50)),
      arrowStartX = endX + (diffIsHeight ? -conf.arrow.width.normal : (sourceOnLeft ? -conf.arrow.height.normal : conf.arrow.height.normal)),
      arrowStartY = endY + (!diffIsHeight ? -conf.arrow.width.normal : (sourceOnTop ? -conf.arrow.height.normal : conf.arrow.height.normal)),
      arrowEndX = endX + (diffIsHeight ? conf.arrow.width.normal : (sourceOnLeft ? -conf.arrow.height.normal : conf.arrow.height.normal)),
      arrowEndY = endY + (!diffIsHeight ? conf.arrow.width.normal : (sourceOnTop ? -conf.arrow.height.normal : conf.arrow.height.normal));


      // start dot
      ctx.beginPath();
      ctx.arc(startX, startY, conf.dot.radius[overSource ? 'overSource' : 'normal'], 0, 2 * Math.PI, false);
      ctx.fillStyle = conf.dot.fillColor[overSource ? 'overSource' : 'normal'];
      ctx.fill();
      ctx.lineWidth = conf.dot.borderWidth[overSource ? 'overSource' : 'normal'];
      ctx.strokeStyle = conf.dot.borderColor[overSource ? 'overSource' : 'normal'];
      ctx.stroke();
      ctx.closePath();

      // line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startControlX, startControlY, endControlX, endControlY, endX, endY);
      ctx.shadowColor = conf.line.shadowColor[overPath ? 'over' : 'normal'];
      ctx.shadowBlur = conf.line.shadowBlur[overPath ? 'over' : 'normal'];
      ctx.lineWidth = conf.line.width[overPath ? 'over' : 'normal'];
      ctx.strokeStyle = conf.line.color[overPath ? 'over' : 'normal'];
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
      // set over path flags
      if (ctx.isPointInPath(status.mouseX, status.mouseY)) {
        status.overPath.source = source;
        status.overPath.dest = dest;
        document.body.style.cursor = 'pointer';
        this.setRedraw();
      } else if (overPath) {
        status.overPath.source = null;
        status.overPath.dest = null;
        document.body.style.cursor = 'auto';
      }
      
      
      // end arrow
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(endX, endY);
      ctx.moveTo(endX, endY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.strokeStyle = conf.arrow.color.normal;
      ctx.stroke();
      ctx.closePath();
    },
    
    itemUpdated: function (updateType, item) {
      this.drawCanvas();
      this.generate();
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