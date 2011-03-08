(function (exports) {
  
  exports.Tweet = function (data, options) {
    this.data = data;
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
  
  exports.Tweet.from = function (options) {
    return new exports.Tweet(options);
  };
  
}(window));