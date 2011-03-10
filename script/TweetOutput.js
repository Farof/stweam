(function (exports) {
  
  exports.TweetOutput = function TweetOutput(options) {
    for (var key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
    if (!this.position) {
      this.position = {
        x: 0,
        y: 0
      }
    }
    this.type = TweetOutputType.items[this.type];
  };
  
  exports.TweetOutput.prototype = {
    constructor: exports.TweetOutput,
    
    name: 'unamed output',
    
    itemType: 'output',
    
    get tweets() {
      return this.input.tweets;
    },
    
    serialize: function () {
      return this.type.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
        type: this.type.type,
        position: this.position
      });
    },
    
    generate: function () {
      this.type.generate.call(this);
      return this;
    },
    
    toWorkspaceElement: function () {
      var el, title, content;
      if (!this.workspaceElement) {
        this.workspaceElement = el = new WorkspaceElement(this);
      }
      return this.workspaceElement;
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