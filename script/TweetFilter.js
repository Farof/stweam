(function (exports) {
  
  exports.TweetFilter = function TweetFilter(options) {
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
    this.param = TweetFilterType.items[this.param];
    this.operator = TweetOperatorType.items[this.operator];
    this.save();
  };
  
  exports.TweetFilter.prototype = {
    constructor: exports.TweetFilter,
    
    name: 'unamed filter',
    
    itemType: 'filter',
    
    get tweets() {
      return this.input.tweets.filter(this.validate);
    },
    
    get type() {
      return this.param;
    },
    
    serialize: function () {
      return this.param.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
        param: this.param.type,
        operator: this.operator.type,
        value: this.value,
        position: this.position
      });
    },
    
    validate: function (tweet) {
      console.log('unsaved filter: ', this);
      return false;
    },
    
    save: function () {
      var
      check = this.operator.check,
      value = this.value,
      param = this.param.type,
      getParam;
      if (this.param.metadata) {
        getParam = function (tweet) {
          return tweet.metadata[param]
        };
      } else {
        getParam = function (tweet) {
          return tweet[param];
        };
      }
      this.validate = function (tweet) {
        return check(value, getParam(tweet.data));
      };
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
  
  exports.TweetFilter.items = [];
  exports.TweetFilter.getById = function (uid) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.TweetFilter.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.TweetFilter.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));