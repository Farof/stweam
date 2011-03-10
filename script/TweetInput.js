(function (exports) {
  
  exports.TweetInput = function TweetInput(options) {
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
    this.type = TweetInputType.items[this.type];
  };
  
  exports.TweetInput.prototype = {
    constructor: exports.TweetInput,
    
    name: 'unamed input',
    
    get tweets() {
      return this.type.retrieve.call(this);
    },
    
    serialize: function () {
      return this.type.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        type: this.type.type,
        position: this.position
      });
    },
    
    toWorkspaceElement: function () {
      var el, title, content;
      if (!this.workspaceElement) {
        this.workspaceElement = el = new WorkspaceElement(this);
      }
      return this.workspaceElement;
    }
  };
  
  exports.TweetInput.items = [];
  exports.TweetInput.getById = function (uid) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.TweetInput.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.TweetInput.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));