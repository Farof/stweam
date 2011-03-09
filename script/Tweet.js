(function (exports) {
  
  exports.Tweet = function (options) {
    for (var key in (options || {})) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
  };
  
  exports.Tweet.prototype = {
    constructor: exports.Tweet,
    
    serialize: function () {
      return {
        uid: this.uid,
        data: this.data
      };
    },
    
    toElement: function () {
      var element, tweet, userName, data = this.data;
      if (!this.element) {
        element = new Element('div', {
          class: 'tweet-box',
          tweet: this
        });
        
        userName = new Element('p', {
          class: 'tweet-author',
          text: data.from_user + ':'
        });
        element.appendChild(userName);
        
        tweet = new Element('p', {
          class: 'tweet',
          text: data.text
        });
        element.appendChild(tweet);
        
        this.element = element;
      }
      return this.element;
    },
    
    toDebugElement: function () {
      var element, key, data = this.data;
      if (!this.debugElement) {
        element = new Element('div', {
          class: 'tweet-box',
          tweet: this
        });
        
        for (key in data) {
          element.appendChild(new Element('p', {
            class: 'tweet-data tweet-' + key,
            text: key + ': ' + data[key]
          }));
        }
        this.debugElement = element;
      }
      return this.debugElement;
    }
  };
  
  exports.Tweet.items = [];
  exports.Tweet.getById = function (uid) {
    for (var i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.Tweet.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.Tweet.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));