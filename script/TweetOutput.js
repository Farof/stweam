(function (exports) {
  
  exports.TweetOutput = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    this.type = TweetOutputType.items[this.type];
  };
  
  exports.TweetOutput.prototype = {
    constructor: exports.TweetOutput,
    
    get tweets() {
      return this.input.tweets;
    },
    
    serialize: function () {
      return {
        type: this.type.type
      };
    },
    
    generate: function () {
      this.type.generate.call(this);
      return this;
    }
  };
  
  exports.TweetOutput.items = [];
  
  exports.TweetOutput.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  
}(window));