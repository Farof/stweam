(function (exports) {
  
  exports.TweetInputType = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  };
  
  exports.TweetInputType.prototype = {
    constructor: exports.TweetInputType,
    
    serialize: function (serializable) {
      return serializable || {};
    },
    
    toLibraryElement: function () {
      var el;
      if (!this.libraryElement) {
        el = new Element('p', {
          'class': 'library-item input-type',
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
  
  exports.TweetInputType.items = {};
  exports.TweetInputType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    document.getElementById('input-type-list').appendChild(item.toLibraryElement());
    return item;
  };
  
  
  exports.TweetInputType.add({
    type: 'global',
    label: 'All sources',
    retrieve: function () {
      return Twitter.tweets;
    }
  });
  
}(window));