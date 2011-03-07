(function (exports) {
  
  exports.TweetOutputType = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  };
  
  exports.TweetOutputType.prototype = {
    constructor: exports.TweetOutputType,
    
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
          class: 'library-item output-type',
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
  
  exports.TweetOutputType.items = {};
  exports.TweetOutputType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    document.getElementById('output-type-list').appendChild(item.toLibraryElement());
    return item;
  };
  
  
  exports.TweetOutputType.add({
    type: 'DOM',
    label: 'DOM',
    generate: function () {
      Element.empty(this.node);
      this.tweets.forEach(function (tweet) {
        this.node.appendChild(tweet.toDebugElement());
      }.bind(this));
    }
  });
  
}(window));