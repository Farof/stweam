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
  
  exports.IDisposable = Trait({
    dispose: Trait.required
  });
  
  exports.IPropertyDispatcher = Trait({
    dispatchableProperties: {},
    
    dispatchProperty: function (prop) {
      var callbacks = this.dispatchableProperties[prop], i, ln;
      
      if (callbacks) {
        for (i = 0, ln = callbacks.length; i < ln; i += 1) {
          callbacks[i](this[prop], prop);
        }
      }
      return this;
    },
    
    addPropertyListener: function (prop, callback) {
      if (!this.dispatchableProperties[prop]) {
        this.dispatchableProperties[prop] = [];
      }
      this.dispatchableProperties[prop].include(callback);
      return this;
    }
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
  
  exports.ITyped = Trait({
    types: Trait.required,
    
    _type: undefined,
    
    get type() {
      return this._type;
    },
    
    set type(value) {
      this._type = this.types.items[value];
    }
  });
  
  exports.ICollectionItem = Trait({
    itemType: Trait.required,
    
    toCollectionElement: function () {
      var el;
      if (!this.collectionElement) {
        el = new Element('p', {
          'class': ('collection-item ' + this.itemType),
          source: this,
          events: {
            click: function (e) {
              if (!this.clickTimer) {
                this.clickTimer = setTimeout(function () {
                  this.clickTimer = null;
                  this.source.load();
                }.bind(this), 200);
              }
            },
            dblclick: function (e) {
              clearTimeout(this.clickTimer);
              this.source.editCollectionElement();
            }
          }
        });
        
        this.collectionTitleElement = new Element('span', {
          'class': 'title',
          text: this.name
        });
        el.appendChild(this.collectionTitleElement);
        
        el.appendChild(new Element('span', {
          'class': 'remove',
          text: '-',
          source: this,
          events: {
            click: function (e) {
              e.stop();
              this.source.dispose();
            }
          }
        }));

        this.collectionElement = el;
      }
      return this.collectionElement;
    },
    
    toCollectionEditElement: function () {
      if (!this.collectionEditElement) {
        this.collectionEditElement = new Element('p', {
          'class': ('collection-item ' + this.itemType)
        });
        this.collectionEditElement.appendChild(new Element('input', {
          type: this.text,
          value: this.name || this.defaultName,
          source: this,
          events: {
            blur: function () {
              this.source.uneditCollectionElement(this);
            },
            keydown: function (e) {
              if (e.keyCode === 13) {
                this.source.uneditCollectionElement(this);
              } else if (e.keyCode === 27) {
                if (this.source.firstInit) {
                  this.blur();
                  this.source.dispose();
                } else {
                  this.value = this.source.name;
                  this.source.uneditCollectionElement(this);
                }
              }
            }
          }
        }))
      }
      return this.collectionEditElement;
    },
    
    editCollectionElement: function () {
      this.collectionElement.parentNode.replaceChild(this.toCollectionEditElement(), this.collectionElement);
      this.collectionEditElement.querySelector('input').focus();
    },
    
    uneditCollectionElement: function (input) {
      var value = input.value || this.defaultName;
      this.firstInit = false;
      this.name = value;
      this.collectionTitleElement.textContent = value;
      this.collectionEditElement.parentNode.replaceChild(this.collectionElement, this.collectionEditElement);
      this.save();
      this.dispatchProperty('name');
    },
  });
  
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

      serializedProperties: [],
      
      config: {},

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
          workspace,
          item, pos, i, ln;
        
        for (i = 0, ln = workspaces.length; i < ln; i += 1) {
          if (clone.hover(workspaces[i])) {
            workspace = workspaces[i];
            break;
          }
        };
        
        if (workspace) {
          pos = workspace.pos();
          item = exports[source.typeGroupConstructor].add({
            process: workspace.process,
            type: source.type,
            position: {
              left: (source.position.left - pos.left),
              top: (source.position.top - pos.top)
            }
          });
          workspace.process.addToWorkspace(item);
          workspace.process.save();
        }
        clone.dispose();
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
        var item;
        Trait.create(Object.prototype, Constructor);
        item = Object.create(Object.prototype, Constructor);
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
  exports.ICollection.create = function (Constructor, trait) {
    return Object.create(Object.prototype, Trait.compose(ICollection(Constructor), (trait || Trait({}))));
  };
  
  exports.IMap = function (Constructor) {
    return Trait({
      items: {},
      
      add: function (options) {
        var item, trait = Trait.override(
          Trait(options),
          Constructor
        );
        Trait.create(Object.prototype, trait);
        item = Object.create(Object.prototype, trait);
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