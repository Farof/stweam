(function (exports) {
  "use strict";
  
  exports.IProcess = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    Trait.resolve({ serialize: 'autoSerialize' }, ISerializable),
    Trait({
      initialize: function Process(options) {
        this.setOptions(options);
        this.initUUID();

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
            if (item.initialize.name === 'TweetOutput') {
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
        
        document.getElementById('processes').appendChild(this.toCollectionElement());
        
        return this;
      },
      
      serializedProperties: ['uid', 'constructorName', 'name'],
      
      serialize: function () {
        var out = this.autoSerialize();
        out.items = this.items.map(function (item) {
          return JSON.stringify(item.serialize());
        });
        return out;
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
        // Process.loadedItem = null;

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
          Process.loadedItem = this;
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
          this.process.dragEvent = new Drag(item.workspaceItem, event, this.process.canvasEl, true);
        }
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
        var i, ln;
        for (i = 0, ln = this.items.length; i < ln; i += 1) {
          this.items[i].draw();
        }
      },

      itemUpdated: function (updateType, item) {
        this.drawCanvas();
        this.generate();
        Twitter.save(this);
      }
    })
  );
  
  exports.Process = ICollection.create(IProcess);
  exports.Process.getByItem = function (item) {
    var i, ln;
    for (i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].contains(item)) {
        return this.items[i];
      }
    }
    return null;
  };
  
}(window));