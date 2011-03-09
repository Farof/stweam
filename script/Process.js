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