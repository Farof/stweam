(function (exports) {
  "use strict";

  exports.ProcessElement = function (source) {
    var i, ln;
    
      source.workspaceZone = new Element('div', {
        id: source.workspaceZoneID,
        'class': ('workspace ' + (source.minimized ? 'minimized' : '')),
        source: source,
        events: {
          mousedown: function (e) {
            this.source.drawCanvas(e);
          },

          mousemove: function (e) {
            this.source.drawCanvas(e);
          },

          mouseup: function (e) {
            var
              process = this.source,
              overPath = process.canvasStatus.overPath,
              overSource = overPath.source,
              overDest = overPath.dest;

            if (overSource && overDest) {
              overDest.removeInput(overSource);
              process.save();
            }

            process.drawCanvas(e);
          }
        }
      });

      source.titlebarElement = new Element('div', {
        'class': 'titlebar'
      });

      source.titlebarElement.appendChild(new Element('span', {
        'class': 'title',
        text: source.name || source.defaultName
      }));
      source.addPropertyListener('name', function (value) {
        source.titlebarElement.querySelector('.title').textContent = value;
      }.bind(source));

      source.titlebarElement.appendChild(new Element('span', {
        'class': 'close control',
        text: 'x',
        source: source,
        events: {
          click: function (e) {
            this.source.unload();
          }
        }
      }));
      source.titlebarElement.appendChild(new Element('span', {
        'class': 'minimize control',
        text: source.workspaceZone.classList.contains('minimized') ? '+' : '-',
        source: source,
        events: {
          click: function (e) {
            this.source.workspaceZone.classList.toggle('minimized');
            this.textContent = this.source.workspaceZone.classList.contains('minimized') ? '+' : '-';
            this.source.drawCanvas();
            this.source.save();
          }
        }
      }));

      source.workspaceZone.appendChild(source.titlebarElement);

      source.workspace = new Element('div', {
        id: source.workspaceID,
        'class': 'workHtml',
        source: source
      });
      source.workspaceZone.appendChild(source.workspace);

      source.itemsContainer = new Element('div', {
        'class': 'item-container',
        source: source
      });
      source.workspace.appendChild(source.itemsContainer);

      source.canvasEl = new Element('canvas', {
        id: source.canvasID,
        'class': 'workCanvas',
        height: '498',
        width: '598',
        process: source
      });
      source.workspace.appendChild(source.canvasEl);
      source.canvas = new Canvas(source.canvasEl, source.workspaceZone);

      source.items.forEach(function (item) {
        source.addToWorkspace(item);
      }.bind(source));
      
    return source.workspaceZone;
  };

}(window));