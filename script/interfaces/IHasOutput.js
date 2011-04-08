(function (exports) {
  "use strict";

  exports.IHasOutput = Trait({
    hasOutput: true,
    
    outputTweets: Trait.required
  });

}(window));