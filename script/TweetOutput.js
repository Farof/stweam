(function (exports) {
  "use strict";

  exports.ITweetOutput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit',
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
        return this.input ? this.input.outputTweets : false;
      },

      set inputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'input=input.uid', 'type=type.type', 'position', 'config'],

      getContentChildren: function () {
        var children = this.getItemContentChildren();
        return children;
      },

      generate: function () {
        return this.type.generate(this);
      }
    })
  );
  
  exports.TweetOutput = ICollection.create(ITweetOutput);
  
}(window));