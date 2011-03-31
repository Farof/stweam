(function (exports) {
  "use strict";
  
  exports.ITweetInputType = Trait.compose(
    IType,
    
    Trait({
      typeGroup: 'input',
      
      retrieve: Trait.required
    })
  );
  
  exports.TweetInputType = IMap.create(ITweetInputType);
  
  
  exports.TweetInputType.add({
    type: 'global',
    label: 'All sources',
    description: 'All tweets from all sources.',
    retrieve: function () {
      return Twitter.tweets;
    }
  });
  
}(window));