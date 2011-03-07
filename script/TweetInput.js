(function (exports) {
  
  exports.TweetInput = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    this.type = TweetInputType.items[this.type];
  };
  
  exports.TweetInput.prototype = {
    constructor: exports.TweetInput,
    
    get tweets() {
      return this.type.retrieve.call(this);
    },
    
    serialize: function () {
      return {
        type: this.type.type
      };
    }
  };
  
  exports.TweetInput.items = [];
  exports.TweetInput.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  
}(window));