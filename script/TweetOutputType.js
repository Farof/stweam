(function (exports) {
  "use strict";
  
  exports.ITweetOutputType = Trait.compose(
    Trait.resolve({ serializedProperties: undefined }, IType),
    
    Trait({
      typeGroup: 'output',
      typeGroupConstructor: 'TweetOutput',

      serializedProperties: ['outputInfo'],
      
      generate: Trait.required,
      
      refreshOutput: Trait.required
    })
  );
  
  exports.TweetOutputType = IMap.create(ITweetOutputType);
  
  
  exports.TweetOutputType.add({
    type: 'DOM',
    label: 'View',
    description: 'Outputs as an HTML view.',
    
    toConfigElement: function () {
      return new ConfigElement();
    },
    
    generate: function (item) {
      var input = item.inputTweets;
      if (input) {
        return input.map(function (tweet) {
          return tweet.toElement();
        });
      }
      return [];
    },
    
    refreshOutput: function (item) {
      var view = View.getById(item.config.view);
      if (view) {
        view.sourceUpdated(item);
      }
    }
  });
  
}(window));