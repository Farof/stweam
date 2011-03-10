(function (exports) {
  
  exports.TweetOperatorType = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  };
  
  exports.TweetOperatorType.prototype = {
    constructor: exports.TweetOperatorType,
    
    serialize: function () {
      return {
        type: this.type,
        label: this.label
      };
    }
  };
  
  exports.TweetOperatorType.items = {};
  exports.TweetOperatorType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    return item;
  };
  
  
  exports.TweetOperatorType.add({
    type: 'is',
    label: 'is',
    description: 'Exact match.',
    
    check: function (filterValue, tweetValue) {
      return tweetValue === filterValue;
    }
  });
  exports.TweetOperatorType.add({
    type: 'contains',
    label: 'contains',
    description: 'Value is contained into tweet matched property.',
    
    check: function (filterValue, tweetValue) {
      return tweetValue.indexOf(filterValue) > -1;
    }
  });
  
}(window));