(function (exports) {
  "use strict";

  exports.IType = Trait.compose(
    IInitializable,
    IHasOptions,
    ISerializable,
    IMovable,
    
    Trait({
      isLibraryItem: true,
      
      typeGroup: Trait.required,
      typeGroupConstructor: Trait.required,
      type: Trait.required,
      label: Trait.required,
      description: Trait.required,
      
      toConfigElement: Trait.required,

      _serializedProperties: null,
      
      get serializedProperties() {
        return this._serializedProperties || (this._serializedProperties = []);
      },

      set serializedProperties(value) {
        this._serializedProperties = value;
      },
      
      _config: null,
      
      get config() {
        return this._config || (this._config = {});
      },

      initialize: function TweetOutputType(options) {
        this.setOptions(options);
        this.initPosition();
        
        document.getElementById(this.typeGroup + '-type-list').appendChild(this.toLibraryElement());
        
        return this;
      },
      
      toLibraryElement: function () {
        var el;
        if (!this.libraryElement) {
          el = new Element('p', {
            'class': ('library-item ' + this.typeGroup + '-type'),
            text: this.label,
            source: this,
            events: {
              mousedown: this.handleElementMousedown,
              click: this.handleElementClick
            }
          });
          this.libraryElement = el;
        }

        return this.libraryElement;
      },

      handleElementMousedown: function (e) {
        var
          t = e.target,
          source = t.source,
          pos = t.pos(),
          clone = source.clonedNode = t.cloneNode(true);
        
        e.stop();
        
        clone.style.position = 'absolute';
        clone.style.left = pos.left + 'px';
        clone.style.top = pos.top + 'px';
        clone.source = source;
        document.body.appendChild(clone);
        Drag.start(clone, e, document.body, true);
      },
      
      dragEnd: function (dragEvent) {
        var
          clone = dragEvent.node,
          source = clone.source,
          workspaces = document.querySelectorAll('.workspace'),
          workspace = workspaces.filterFirst(function (aWorkspace) {
            return clone.hover(aWorkspace);
          }),
          item, pos, i, ln;
        
        if (workspace) {
          pos = workspace.pos();
          item = exports[source.typeGroupConstructor].add({
            process: workspace.source,
            type: source.type,
            position: {
              left: (source.position.left - pos.left),
              top: (source.position.top - pos.top)
            }
          });
          workspace.source.addToWorkspace(item);
          workspace.source.save();
        }
        clone.dispose();
        source.clonedNode = null;
        clone.source = null;
      },

      handleElementClick: function (e) {
        
      }
    })
  );

}(window));