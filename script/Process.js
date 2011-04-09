(function (exports) {
  "use strict";
  
  exports.IProcess = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    Trait.resolve({ serialize: 'autoSerialize' }, ISerializable),
    IPropertyDispatcher,
    IDisposable,
    ICollectionItem,
    
    Trait({
      defaultName: 'unamed process',
      itemType: 'process',
      
      _items: null,
      
      get items() {
        return this._items || (this._items = []);
      },

      set items(value) {
        this._items = value;
      },
      
      initialize: function Process(options) {
        var i, ln, j, ln2, k, ln3, item, input;
        
        this.setOptions(options);
        this.initUUID();

        this.outputs = [];

        if (this.items) {
          for (i = 0, ln = this.items.length; i < ln; i += 1) {
            item = this.items[i];
            // converting serialized items
            if (typeof item === 'string') {
              item = this.items[i] = Twitter.deserialize(item);
            }
            if (!item.process) {
              item.process = this;
            }
            
            if (!item.type) {
              this.removeFromWorkspace(item);
              this.save();
            }

            // registering process outputs
            if (item.initialize.name === 'TweetOutput') {
              this.outputs.include(item);
            }
          }
          
          for (i = 0, ln = this.items.length; i < ln; i += 1) {
            item = this.items[i];
            if (item.hasInputs) {
              for (j = 0, ln2 = item.inputs.length; j < ln2; j += 1) {
                input = item.inputs[j];
                if (typeof input === 'string') {
                  item.inputs[j] = this.items.filterFirst(function (inputItem) {
                    return inputItem.uid === input;
                  }) || input;
                }
              }
            }
          }
        }
        
        document.getElementById('processes').appendChild(this.toCollectionElement());
        
        return this;
      },
      
      serializedProperties: ['uid', 'constructorName', 'name'],
      
      serialize: function () {
        var out = this.autoSerialize();
        out.items = this.items.map(function (item) {
          return JSON.stringify(item.serialize());
        });
        out.collectionIndex = Process.items.indexOf(this);
        out.minimized = this.workspaceZone ? this.workspaceZone.classList.contains('minimized') : false;
        return out;
      },

      contains: function (itemToFind) {
        return this.items.filter(function (item) {
          return item === itemToFind;
        }).length === 1;
      },
      
      get loaded() {
        return Process.loadedItems.contains(this);
      },

      unload: function () {
        if (this.loaded) {
          this.workspaceZone.dispose();
          Process.loadedItems.remove(this);
        }
        return this;
      },

      load: function () {
        var workspace;
        
        if (!this.loaded) {
          workspace = document.getElementById('workspaceZone');
          workspace.appendChild(this.toWorkspaceElement());
          this.drawCanvas();
          Process.loadedItems.include(this);
        }

        return this;
      },

      canvasStatus: {
        overItem: null,
        overPath: {}
      },
      
      get workspaceZoneID() {
        return 'workspace:' + this.uid;
      },
      
      get workspaceID() {
        return 'workHTML:' + this.uid;
      },
      
      get canvasID() {
        return 'workCanvas:' + this.uid;
      },

      toWorkspaceElement: function () {
        var el, htmlEl, canvasEl, i, ln;
        if (!this.workspaceZone) {
          this.workspaceZone = el = new Element('div', {
            id: this.workspaceZoneID,
            'class': ('workspace ' + (this.minimized ? 'minimized' : '')),
            process: this,
            events: {
              mousedown: function (e) {
                this.process.drawCanvas(e);
              },

              mousemove: function (e) {
                this.process.drawCanvas(e);
              },
              
              mouseup: function (e) {
                var
                  process = this.process,
                  overPath = process.canvasStatus.overPath,
                  overSource = overPath.source,
                  overDest = overPath.dest;
                
                if (overSource && overDest) {
                  overDest.removeInput(overSource);
                  process.save();
                }
                
                this.process.drawCanvas(e);
              }
            }
          });
          
          this.titlebarElement = new Element('div', {
            'class': 'titlebar'
          });
          
          this.titlebarElement.appendChild(new Element('span', {
            'class': 'title',
            text: this.name || this.defaultName
          }));
          this.addPropertyListener('name', function (value) {
            this.titlebarElement.querySelector('.title').textContent = value;
          }.bind(this));
          
          this.titlebarElement.appendChild(new Element('span', {
            'class': 'close control',
            text: 'x',
            source: this,
            events: {
              click: function (e) {
                this.source.unload();
              }
            }
          }));
          this.titlebarElement.appendChild(new Element('span', {
            'class': 'minimize control',
            text: this.workspaceZone.classList.contains('minimized') ? '+' : '-',
            source: this,
            events: {
              click: function (e) {
                this.source.workspaceZone.classList.toggle('minimized');
                this.textContent = this.source.workspaceZone.classList.contains('minimized') ? '+' : '-';
                this.source.drawCanvas();
                this.source.save();
              }
            }
          }));
          
          this.workspaceZone.appendChild(this.titlebarElement);
          
          this.workspace = htmlEl = new Element('div', {
            id: this.workspaceID,
            'class': 'workHtml',
            process: this
          });
          el.appendChild(htmlEl);
          
          this.itemsContainer = new Element('div', {
            'class': 'item-container',
            source: this
          });
          this.workspace.appendChild(this.itemsContainer);

          this.canvasEl = canvasEl = new Element('canvas', {
            id: this.canvasID,
            'class': 'workCanvas',
            height: '498',
            width: '598',
            process: this
          });
          this.workspace.appendChild(this.canvasEl);
          this.canvas = new Canvas(canvasEl, el);

          this.items.forEach(function (item) {
            this.addToWorkspace(item);
          }.bind(this));
        }
        return this.workspaceZone;
      },

      addToWorkspace: function (item) {
        var el = item.toWorkspaceElement();
        this.itemsContainer.appendChild(el);
        this.items.include(item);
        if (item.initialize.name === 'TweetOutput') {
          this.outputs.include(item);
        }
        return this;
      },
      
      removeFromWorkspace: function (item) {
        this.items.remove(item);
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
            width: { normal: 3, over: 3 },
            color: { normal: '#3E3D40', over: '#3E3D40' },
            shadowColor: { normal: '#3E3D40', over: '#FF0000' },
            shadowBlur: { normal: 0, over: 1 }
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
        if (this.canvas) {
          this.canvas.clear();
          this.drawPaths();
          this.drawMouse();
          if (this.canvasStatus.redraw === true) {
            this.canvasStatus.redraw = false;
            this.drawCanvas();
            this.canvasStatus.redraw = null;
          }
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
        var i, ln;
        for (i = 0, ln = this.items.length; i < ln; i += 1) {
          this.items[i].draw();
        }
      },

      itemUpdated: function (updateType, item) {
        this.drawCanvas();
        this.save();
      },
      
      save: function () {
        Twitter.save(this);
      },
      
      dispose: function () {
        while (this.items.first) {
          this.items.first.dispose();
        }
        
        this.dispatchableProperties = null;
        this.unload();
        this.collectionElement.dispose();
        Process.removeItem(this);
        return this;
      }
    })
  );
  
  exports.Process = new Collection(IProcess, Trait({
    loadedItems: [],
    
    getByItem: function (item) {
      var i, ln;
      for (i = 0, ln = this.items.length; i < ln; i += 1) {
        if (this.items[i].contains(item)) {
          return this.items[i];
        }
      }
      return null;
    },
    
    unloadAll: function () {
      var i, ln;
      for (i = 0, ln = this.items.length; i < ln; i += 1) {
        this.items[i].unload();
      };
      return this;
    },
    
    loadAll: function () {
      var i, ln;
      for (i = 0, ln = this.items.length; i < ln; i += 1) {
        this.items[i].load();
      };
      return this;
    },
    
    drawLoaded: function () {
      var i, ln;
      for (i = 0, ln = this.items.length; i < ln; i += 1) {
        this.items[i].drawCanvas();
      };
      return this;
    },
    
    createNew: function () {
      var item = this.add();
      item.load();
      this.items.dispatchProperty('length');
      Process.drawLoaded();
      Twitter.save();
      item.firstInit = true;
      item.editCollectionElement();
    },
    
    removeItem: function (item) {
      this.items.remove(item);
      this.items.dispatchProperty('length');
      Process.drawLoaded();
      Twitter.storage.removeItem(item);
    }
  }));
  Object.defineProperties(Process.items, IPropertyDispatcher);
  
}(window));