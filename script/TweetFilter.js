(function (exports) {
  "use strict";
  
  exports.ITweetFilter = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit',
                    getContentChildren: 'getItemContentChildren' }, IWorkspaceItem),
    IHasInput,
    IHasOutput,
    
    Trait({
      initialize: function TweetFilter(options) {
        this.workspaceItemInit(options);
        this.save();
        return this;
      },
      
      name: 'unamed filter',

      itemType: 'filter',
      
      types: TweetFilterType,
      
      configElements: {},

      get inputTweets() {
        return this.input ? this.input.outputTweets : false;
      },

      set inputTweets(value) {
        throw new Error('read only');
      },

      get outputTweets() {
        return this.inputTweets ? this.inputTweets.filter(this.validate) : false;
      },

      set outputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'input=input.uid',
                              'type=type.type', 'config', 'position'],

      validate: function (tweet) {
        console.log('unsaved filter: ', this);
        return false;
      },

      save: function () {
        this.validate = this.type.validator(this.config);
        return this;
      },
      
      getContentChildren: function () {
        var children = this.getItemContentChildren();
        return children;
      }
    })
  );
  
  exports.TweetFilter = new Collection(ITweetFilter);
  
}(window));