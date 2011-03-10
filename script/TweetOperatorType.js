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
    },
    
    toLibraryElement: function () {
      var el;
      if (!this.libraryElement) {
        el = new Element('p', {
          'class': 'library-item operator-type',
          text: this.label,
          type: this,
          events: {
            click: function (e) {
              console.log(this.type);
            }
          }
        });
        this.libraryElement = el;
      }
      return this.libraryElement;
    }
  };
  
  exports.TweetOperatorType.items = {};
  exports.TweetOperatorType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    document.getElementById('operator-type-list').appendChild(item.toLibraryElement());
    return item;
  };
  
  
  exports.TweetOperatorType.add({
    type: 'is',
    label: 'is',
    check: function (filterValue, tweetValue) {
      return tweetValue === filterValue;
    }
  });
  exports.TweetOperatorType.add({
    type: 'contains',
    label: 'contains',
    check: function (filterValue, tweetValue) {
      return tweetValue.indexOf(filterValue) > -1;
    }
  });
  
}(window));