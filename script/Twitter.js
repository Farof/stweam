(function (exports) {
  var
  uid = 0,
  nextUID = function () {
    return (uid++).toString();
  };
  
  exports.Twitter = {
    get uid() {
      return nextUID();
    },
    
    get tweets() {
      return Tweet.items;
    },
    
    get tweetsId() {
      return this.tweets.map(function (tweet) {
        return tweet.id;
      });
    },
    
    includeTweets: function (tweets) {
      var ids = this.tweetsId;
      tweets.forEach(function (tweet) {
        if (ids.indexOf(tweet.id) < 0) {
          this.tweets.push(tweet);
        }
      }.bind(this));
    },
    
    deserialize: function (serializable) {
      var options, constructor, item;
      try {
        options = JSON.parse(serializable);
      } catch (e) {
        console.log(e.message, e);
        return null;
      }
      
      constructor = exports[options.constructorName]
      if (constructor) {
        if (options.uid) {
          item = constructor.getById(options.uid);
        }
        if (item) {
          return item;
        } else {
          item = constructor.from(options);
          return item;
        }
      }
      return options;
    }
  };
  
}(window));