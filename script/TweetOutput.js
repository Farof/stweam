(function (exports) {
  "use strict";

  exports.ITweetOutput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit',
                    serialize: 'autoSerialize',
                    getContentChildren: 'getItemContentChildren' }, IWorkspaceItem),
    IHasInput,
    Trait({
      initialize: function TweetOutput(options) {
        this.workspaceItemInit(options);
        
        return this;
      },
      
      name: 'unamed output',

      itemType: 'output',
      
      types: TweetOutputType,

      get inputTweets() {
        return this.inputs.reduce(function (previous, current) {
          return previous.merge(current.outputTweets);
        }, []);
      },

      set inputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'type=type.type', 'position', 'config'],
      
      serialize: function () {
        var out = this.autoSerialize();
        out.inputs = this.inputs.map(function (input) {
          return input.uid;
        });
        return out;
      },

      getContentChildren: function () {
        var children = this.getItemContentChildren();
        return children;
      },

      generate: function () {
        return this.type.generate(this);
      }
    })
  );
  
  exports.TweetOutput = new Collection(ITweetOutput);
  
}(window));