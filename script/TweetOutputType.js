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
  
  exports.TweetOutputType = new Map(ITweetOutputType);
  
  
  exports.TweetOutputType.add({
    type: 'DOM',
    label: 'View',
    description: 'Outputs as an HTML view.',
    
    toConfigElement: function (item) {
      var mapDatasource = function (items) {
        return items.map(function (view) {
          return {
            bind: view,
            bindProp: 'name',
            type: view.uid,
            label: view.name,
            description: ''
          };
        });
      };
      
      return new ConfigElement(
        new SelectLine('view: ', mapDatasource(View.items), function (e) {
          var view;
          if (item.config.view) {
            view = View.getById(item.config.view);
            if (view) {
              view.sources.remove(item);
            }
          }
          item.config.view = this.value;
          view = View.getById(item.config.view);
          if (view) {
            view.sources.include(item);
          }
          item.updated('view');
        },
        item.config.view,
        (View.items[0] ? View.items[0].uid : 0), {
          datasource: View.items,
          onDatasourceChange: mapDatasource
        })
      );
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
      if (view && view.loaded) {
        view.sourceUpdated(item);
      }
    }
  });
  
}(window));