(function (exports) {
  "use strict";
  
  exports.IWorkspaceItem = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    Trait.resolve({ dragPositionUpdated: 'workspaceItemPositionUpdated' }, IMovable),
    Trait.resolve({ serialize: 'workspaceItemSerialize' }, ISerializable),
    ITyped,
    IHasConfig,
    IDisposable,
    
    Trait({
      isWorkspaceItem: true,
      
      name: Trait.required,
      itemType: Trait.required,
      
      _process: undefined,
      
      get process() {
        return this._process;
      },
      
      set process(value) {
        if (typeof value === 'string') {
          this._process = Process.getById(value);
        } else if (typeof value === 'object') {
          this._process = value;
        }
      },
      
      initialize: function (options) {
        this.setOptions(options);
        this.initUUID();
        this.initPosition();
        
        if (!this._process) {
          this._process = Process.getByItem(this);
        }
        
        return this;
      },
      
      serialize: function () {
        return this.type.serialize.call(this, this.workspaceItemSerialize(), this.type.serializedProperties);
      },
      
      dispose: function () {
        this.input = null;
        if (this.output) {
          this.output.input = null;
        }
        if (this.workspaceElement) {
          this.workspaceElement.source = null;
          this.workspaceElement.dispose();
        }
        if (this.process) {
          this.process.removeFromWorkspace(this);
          this.process.save();
        }
      },
      
      toWorkspaceElement: function () {
        var el;
        if (!this.workspaceElement) {
          this.workspaceElement = el = new WorkspaceElement(this);
        }
        return this.workspaceElement;
      },
      
      getContentChildren: function () {
        var children, child;
        if (!this.contentChildren) {
          this.contentChildren = children = [];

          child = new Element('p', {
            'class': 'item-content-zone item-type',
            title: this.type.description || ''
          });
          child.appendChild(new Element('span', {
            'class': 'item-content-label item-type-label',
            text: (this.itemType + ': ')
          }));
          child.appendChild(new Element('span', {
            'class': 'item-content item-type-name',
            text: this.type.label
          }));
          children.push(child);
          
          children.push(this.toConfigElement());
        }
        return this.contentChildren;
      },
      
      handleMousedown: function (e) {
        if (this.hasOutput && !this.output && e.shiftKey) {
          e.stop();
          this.linking = true;
        } else if (e.altKey) {
          e.stop();
          this.dispose();
        }
      },
      
      updated: function (type, value) {
        if (value) {
          this[type] = value;
        }
        if (this.output) {
          this.output.inputUpdated(type, this);
        }
        if (this.workspaceElement) {
          this.process.itemUpdated(type, this);
        }
        return this;
      },
      
      dragPositionUpdated: function (x, y) {
        this.workspaceItemPositionUpdated(x, y);
        this.process.drawCanvas();
      },
      
      dragEnd: function (dragEvent) {
        if (dragEvent.node.dragged) {
          // this.node.querySelector('.workspace-item-title-zone').save();
          this.updated('position');
        }
        this.process.dragEvent = null;
      },
      
      get canvas() {
        return this.process.canvas;
      },
      
      set canvas(value) {
        // fail silently
      },
      
      get linking() {
        return this.process ? (this.process.canvasStatus.linkingFrom === this) : false;
      },
      
      set linking(value) {
        if (this.process) {
          this.process.canvasStatus.linkingFrom = value ? this : null;
        }
      },
      
      acceptsLinkFrom: function (item) {
        return item !== this;
      },
      
      acceptsLinkTo: function (item) {
        return item !== this && item.acceptsLinkFrom(this);
      },
      
      draw: function () {
        this.drawLinks();
        return this;
      },
      
      drawLinks: function () {
        var el, dest;
        if (this.input) {
          if (typeof this.input === 'string') {
            //this.input = this.input;
          }
          this.drawLinkFromItem(this.input);
        }
        if (this.linking) {
          dest = this.process.canvasStatus.overItem;
          if (dest && dest.source !== this) {
            this.drawLinkToPoint(dest);
          } else {
            el = new Element('div', {
              style: 'position: absolute; width: 0px; height: 0px'
            });
            el.style.left = this.canvas.mouseX + 'px';
            el.style.top = this.canvas.mouseY + 'px';
            this.process.workspace.appendChild(el);
            this.drawLinkToPoint(el);
            el.dispose();
          }
        }
        return this;
      },
      
      drawLinkFromItem: function (source) {
        source.drawLinkToPoint(this.workspaceElement);
        return this;
      },
      
      drawLinkToPoint: function (dest) {
        var
          source = this.workspaceElement,

        // path conf
          status = this.process.canvasStatus,
          conf = this.process.canvasConf.itemPath,
          overSource = status.overItem === source,
          overPath = status.overPath && status.overPath.source === source.source && status.overPath.dest === dest.source,

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
          status.overPath.source = source.source;
          status.overPath.dest = dest.source;
          document.body.style.cursor = 'pointer';
          this.process.setRedraw();
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
      }
    })
  );
  
}(window));