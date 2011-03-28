(function (exports) {
  "use strict";
  
  exports.ITweetInput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit', getContentChildren: 'getItemContentChildren' }, IWorkspaceItem),
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

      updated: function (type, value) {
        if (type === 'name') {
          this.name = value;
        }
        if (this.process) {
          this.process.itemUpdated(type, this);
        }
      },
      
      getContentChildren: function () {
        var children = this.getItemContentChildren();
        return children;
      }
    })
  );
  
  exports.TweetInput = ICollection.create(ITweetInput);
  
}(window));