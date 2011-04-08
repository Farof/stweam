(function (exports) {
  "use strict";
  
  exports.ITweetInputType = Trait.compose(
    IType,
    
    Trait({
      typeGroup: 'input',
      typeGroupConstructor: 'TweetInput',
      
      retrieve: Trait.required
    })
  );
  
  exports.TweetInputType = new Map(ITweetInputType);
  
  
  exports.TweetInputType.add({
    type: 'global',
    label: 'All sources',
    description: 'All tweets from all sources.',
    
    toConfigElement: function () {
      return new ConfigElement();
    },
    
    retrieve: function () {
      return Twitter.tweets;
    }
  });
  
}(window));