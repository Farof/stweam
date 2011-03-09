(function (exports) {
  
  exports.TweetOutput = function TweetOutput(options) {
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
      return this.type.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
        type: this.type.type
      });
    },
    
    generate: function () {
      this.type.generate.call(this);
      return this;
    }
  };
  
  exports.TweetOutput.items = [];
  exports.TweetOutput.getById = function (uid) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.TweetOutput.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.TweetOutput.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));