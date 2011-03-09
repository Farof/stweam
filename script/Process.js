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
          class:'collection-item process',
          text: this.name,
          events: {
            click: function () {
              console.log(this.serialize());
              this.loadInWorkspace();
            }.bind(this)
          }
        });
        
        this.collectionElement = el;
      }
      return this.collectionElement;
    },
    
    unloadFromWorkspace: function () {
      throw new Error('to implement');
      
      this.loaded = false;
      
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
        
        this.loaded = true;
      }
      
      return this;
    },
    
    get canvas() {
      if (!this._canvas) {
        this.toWorkspaceElement();
      }
      return this._canvas;
    },
    
    get workspace() {
      if (!this._workspace) {
        this.toWorkspaceElement();
      }
      return this._workspace;
    },
    
    toWorkspaceElement: function () {
      var el, htmlEl, canvasEl, i, ln;
      if (!this.workspaceZone) {
        this.workspaceZone = el = new Element('div', {
          id: 'workspace',
          process: this
        });
        this._workspace = htmlEl = new Element('div', {
          id: 'workHtml',
          process: this,
          events: {
            mousedown: this.handleWorkspaceMousedown
          }
        });
        el.appendChild(htmlEl);
        this._canvas = canvasEl = new Element('canvas', {
          id: 'workCanvas',
          height: '500',
          width: '600',
          process: this
        });
        el.appendChild(canvasEl);
        
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
      var item = event.target, classes = item.classList;
      if (classes.contains('workspace-item-title')) {
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
      
      this.workspace.addEventListener('mousemove', this.doDrag, false);
      document.addEventListener('mouseup', this.stopDrag, true);
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
      
      style.position = 'absolute';
      style.left = left + 'px';
      style.top = top + 'px';
      //draggedItem.querySelector('.workspace-item-content').innerHTML = '( ' + style.left + ' ; ' + style.top + ' )';
    },
    
    stopDrag: function (event) {
      var process = document.getElementById('workspace').process;
      process.workspace.removeEventListener('mousemove', process.doDrag, false);
      document.removeEventListener('mouseup', process.stopDrag, true);
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