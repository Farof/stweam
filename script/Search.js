(function (exports) {
  
  exports.Search = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
    
    if (this.results) {
      this.results = this.results.map(Tweet.from);
      Twitter.includeTweets(this.results);
    }
  };
  
  exports.Search.prototype = {
    constructor: exports.Search
  };
  
}(window));