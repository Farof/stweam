(function (exports) {
  "use strict";
  
  exports.Process = function Process(options) {
    var key;
    for (key in options) {
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
          })[0] || item.input;
        }
      }.bind(this));
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
      
      // this.loaded = false;
      // this.constructor.loadedItem = null;
      
      // return this;
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
      overPath: {}
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
                item = target.classList.contains('workspace-item') ? target : Element.getParentByClass(target, 'workspace-item');
              
              if ((!process.canvasStatus.overItem && item) ||
                  (process.canvasStatus.overItem && item && process.canvasStatus.overItem !== item)) {
                process.canvasStatus.overItem = item;
              } else if (process.canvasStatus.overItem && !item) {
                process.canvasStatus.overItem = null;
              }
              
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
        
        this.canvasEl = canvasEl = new Element('canvas', {
          id: 'workCanvas',
          height: '500',
          width: '600',
          process: this
        });
        el.appendChild(canvasEl);
        this.canvas = new Canvas(canvasEl, el);
        
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
        canvas = process.canvasEl,
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
      var process = document.getElementById('workspace').process;
      
      document.removeEventListener('mousemove', process.doDrag, false);
      document.removeEventListener('mouseup', process.stopDrag, true);
      
      process._draggedItem.dragging = false;
      if (process._draggedItem.dragged) {
        process._draggedItem.querySelector('.workspace-item-title-zone').save();
      }
      
      Twitter.save(process);
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
          borderColor: { normal: '#3E3D40', overSource: '#3E3D40' }
        },
        line: {
          width: { normal: 2, over: 3 },
          color: { normal: '#3E3D40', over: '#3E3D40' },
          shadowColor: { normal: '#3E3D40', over: '#FF0000' },
          shadowBlur: { normal: 0, over: 2 }
        },
        arrow: {
          width: { normal: 10 },
          radius: { normal: 12 },
          lineWidth: { normal: 2 },
          color: { normal: '#3E3D40' }
        }
      }
    },
    
    drawCanvas: function () {
      this.canvas.clear();
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
        conf = this.canvasConf.mouse,
        confType = 'normal';

      this.canvas.circle({
        x: this.canvas.mouseX, 
        y: this.canvas.mouseY,
        r: conf.circle.radius[confType],
        stroke: {
          lineWidth: conf.circle.borderWidth[confType],
          strokeStyle: conf.circle.borderColor[confType]
        }
      });
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
      
      // path conf
        status = this.canvasStatus,
        conf = this.canvasConf.itemPath,
        overSource = status.overItem === source,
        overPath = status.overPath && status.overPath.source === source && status.overPath.dest === dest,
      
      // coordinates
        startX = source.getAttachXFor(dest),
        startY = source.getAttachYFor(dest),
        endX = dest.getAttachXFor(source),
        endY = dest.getAttachYFor(source),
        startControlX = source.getAttachXControlFor(dest, startX),
        startControlY = source.getAttachYControlFor(dest, startY),
        endControlX = dest.getAttachXControlFor(source, endX),
        endControlY = dest.getAttachYControlFor(source, endY);

      // line
      if (this.canvas.bezier({
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
          startControlX: startControlX,
          startControlY: startControlY,
          endControlX: endControlX,
          endControlY: endControlY,
          stroke: {
            shadowColor: conf.line.shadowColor[overPath ? 'over' : 'normal'],
            shadowBlur: conf.line.shadowBlur[overPath ? 'over' : 'normal'],
            lineWidth: conf.line.width[overPath ? 'over' : 'normal'],
            strokeStyle: conf.line.color[overPath ? 'over' : 'normal'],
            lineCap: 'round'
          }
        })) {
        status.overPath.source = source;
        status.overPath.dest = dest;
        document.body.style.cursor = 'pointer';
        this.setRedraw();
      } else if (overPath) {
        status.overPath.source = null;
        status.overPath.dest = null;
        document.body.style.cursor = 'auto'; 
      }
      
      // start dot
      if (this.canvas.circle({
          x: startX,
          y: startY,
          r: conf.dot.radius[overSource ? 'overSource' : 'normal'],
          fill: { 
            fillStyle: conf.dot.fillColor[overSource ? 'overSource' : 'normal']
          },
          stroke: {
            lineWidth: conf.dot.borderWidth[overSource ? 'overSource' : 'normal'],
            strokeStyle: conf.dot.borderColor[overSource ? 'overSource' : 'normal']
          }
        })) {
        // do something if over start dot
      }
      
      // end arrow
      if (this.canvas.arrow({
          x: endX,
          y: endY,
          width: conf.arrow.width.normal,
          radius: conf.arrow.radius.normal,
          angle: Math.atan2(endControlX - endX, endControlY - endY),
          stroke: {
            strokeStyle: conf.arrow.color.normal,
            lineWidth: conf.arrow.lineWidth.normal
          }
        })) {
        // do something if over arrow
      }
    },
    
    itemUpdated: function (updateType, item) {
      this.drawCanvas();
      this.generate();
      Twitter.save(this);
    }
  };
  
  exports.Process.items = [];
  exports.Process.getById = function (uid) {
    var i, ln;
    for (i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.Process.getByItem = function (item) {
    var i, ln;
    for (i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].contains(item)) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.Process.add = function (options) {
    var item = new exports.Process(options);
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