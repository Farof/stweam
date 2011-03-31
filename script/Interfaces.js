(function (exports) {
  "use strict";
  
  exports.IHasOptions = Trait({
    setOptions: function (options) {
      var key;
      for (key in options) {
        this[key] = options[key];
      }
      return this;
    }
  });
  
  exports.IHasUUID = Trait({
    initUUID: function () {
      if (!this.uid) {
        this.uid = Twitter.uid;
      }
      return this;
    }
  });
  
  exports.IMovable = Trait({
    isMovable: true,
    
    initPosition: function () {
      if (!this.position) {
        this.position = {
          x: 0,
          y: 0
        };
      }
    },
    
    dragPositionUpdated: function (x, y) {
      this.position.left = x;
      this.position.top = y;
    },
    
    dragEnd: Trait.required
  });
  
  exports.IInitializable = Trait({
    initialize: Trait.required
  });
  
  exports.ISerializable = Trait({
    serializedProperties: Trait.required,
    
    get constructorName() {
      return this.initialize.name;
    },
    
    set constructorName(value) {
      // do nothing
    },
    
    serialize: function (out, props) {
      // refaire le name=path
      var props = (props || this.serializedProperties), prop, propName, propPath, propValue, i, ln;
      out = out || {};
      for (i = 0, ln = props.length; i < ln; i += 1) {
        prop = props[i].split('=');
        propName = prop[0]
        propPath = (prop[1] || propName).split('.');
        propValue = this;
        while (propValue && propPath.length > 0) {
          propValue = propValue[propPath.shift()];
        }
        out[propName] = propValue;
      }
      return out;
    }
  });
  
  exports.IType = Trait.compose(
    IInitializable,
    IHasOptions,
    ISerializable,
    IMovable,
    
    Trait({
      isLibraryItem: true,
      
      typeGroup: Trait.required,
      type: Trait.required,
      label: Trait.required,
      description: Trait.required,


      serializedProperties: [],

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
          pos = Element.pos(t),
          clone = source.clonedNode = t.cloneNode(true);
        
        e.stop();
        
        clone.style.position = 'absolute';
        clone.style.left = pos.x + 'px';
        clone.style.top = pos.y + 'px';
        clone.source = source;
        document.body.appendChild(clone);
        Drag.start(clone, e, document.body, true);
      },
      
      dragEnd: function (dragEvent) {
        var
          clone = dragEvent.node,
          source = clone.source,
          workspace = document.getElementById('workspace');
          
        if (clone.hover(workspace)) {
          console.log('drop');
        }
        clone.parentNode.removeChild(clone);
        source.clonedNode = null;
        clone.source = null;
      },

      handleElementClick: function (e) {
        console.log('click: ', this.type);
      }
    })
  );
  
  exports.ICollection = function (Constructor) {
    return Trait({
      items: [],
      
      getById: function (uid) {
        var i, ln;
        for (i = 0, ln = this.items.length; i < ln; i += 1) {
          if (this.items[i].uid === uid) {
            return this.items[i];
          }
        }
        return null;
      },
      
      add: function (options) {
        var item = Object.create(Object.prototype, Constructor);
        this.items.push(item);
        if (item.initialize) {
          item.initialize(options);
        }
        return item;
      },
      
      from: function (options) {
        var item = (options && options.uid) ? this.getById(options.uid) : null;
        if (!item) {
          item = this.add.apply(this, arguments);
        }
        return item;
      }
    });
  };
  exports.ICollection.create = function (Constructor) {
    return Object.create(Object.prototype, ICollection(Constructor));
  };
  
  exports.IMap = function (Constructor) {
    return Trait({
      items: {},
      
      add: function (options) {
        var item = Object.create(Object.prototype, Trait.override(
          Trait(options),
          Constructor
        ));
        this.items[options.type] = item;
        if (item.initialize) {
          item.initialize(options);
        }
        return item;
      }
    });
  };
  
  exports.IMap.create = function (Constructor) {
    return Object.create(Object.prototype, IMap(Constructor));
  };
  
}(window));