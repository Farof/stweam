(function (exports) {
  "use strict";
  
  exports.ITweetInput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit',
                    getContentChildren: 'getItemContentChildren' }, IWorkspaceItem),
    IHasOutput,
    Trait({
      initialize: function TweetInput(options) {
        this.workspaceItemInit(options);
        
        return this;
      },

      name: 'unamed input',

      itemType: 'input',
      
      types: TweetInputType,

      get outputTweets() {
        return this.type.retrieve.call(this);
      },

      set outputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'type=type.type', 'position'],
      
      onConfigChange: function () {
        throw new Error('not yet implemented');
      },
      
      getContentChildren: function () {
        return this.getItemContentChildren();
      }
    })
  );
  
  exports.TweetInput = new Collection(ITweetInput);
  
}(window));