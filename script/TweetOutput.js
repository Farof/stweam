(function (exports) {
  
  exports.TweetOutput = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
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
        uid: this.uid,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
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