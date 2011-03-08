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
    
    tweets: [],
    
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
    }
  };
  
}(window));