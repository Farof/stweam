(function (exports) {
  
  exports.TweetFilter = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
    this.param = TweetFilterType.items[this.param];
    this.operator = TweetOperatorType.items[this.operator];
    this.save();
  };
  
  exports.TweetFilter.prototype = {
    constructor: exports.TweetFilter,
    
    get tweets() {
      return this.input.tweets.filter(this.validate);
    },
    
    serialize: function () {
      return {
        uid: this.uid,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
        param: this.param.type,
        operator: this.operator.type,
        value: this.value
      };
    },
    
    toElement: function () {
      if (!this.element) {
        
      }
      return this.element;
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
    }
  };
  
  exports.TweetFilter.items = [];
  exports.TweetFilter.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  
}(window));