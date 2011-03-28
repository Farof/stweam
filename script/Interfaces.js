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
    initPosition: function () {
      if (!this.position) {
        this.position = {
          x: 0,
          y: 0
        };
      }
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
    
    serialize: function () {
      var out = {}, props = this.serializedProperties, prop, propName, propPath, propValue, i, ln;
      for (i = 0, ln = props.length; i < ln; i += 1) {
        prop = props[i].split('=');
        propName = prop[0]
        propPath = (prop[1] || propName).split('.');
        propValue = this;
        while (propPath.length > 0) {
          propValue = propValue[propPath.shift()];
        }
        out[propName] = propValue;
      }
      return out;
    }
  });
  
  exports.IHasOutput = Trait({
    outputTweets: Trait.required
  });
  
  exports.IHasInput = Trait({
    inputTweets: Trait.required
  });
  
  exports.IWorkspaceItem = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    IMovable,
    ISerializable,
    Trait({
      name: Trait.required,
      itemType: Trait.required,
      
      initialize: function (options) {
        this.setOptions(options);
        this.initUUID();
        this.initPosition();
        return this;
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
        if (item.initialize) {
          item.initialize(options);
        }
        this.items.push(item);
        return item;
      },
      
      from: function (options) {
        var item = (options && options.uid) ? this.getById(options.uid) : null;
        if (!item) {
          item = this.add.apply(this, arguments);
        }
        return item;
      }
    })
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
        if (item.initialize) {
          item.initialize(options);
        }
        this.items[options.type] = item;
        return item;
      }
    });
  };
  
  exports.IMap.create = function (Constructor) {
    return Object.create(Object.prototype, IMap(Constructor));
  };
  
}(window));