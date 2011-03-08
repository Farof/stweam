(function (exports) {
  
  exports.Process = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
    
    this.outputs = [];
    
    if (this.items) {
      this.items.forEach(function (item) {
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
        name: this.name,
        items: this.items.map(function (item) {
          return item.serialize();
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
  exports.Process.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  
}(window));