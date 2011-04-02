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
        var children = this.getItemContentChildren();
        return children;
      }
    })
  );
  
  exports.TweetInput = ICollection.create(ITweetInput);
  
}(window));