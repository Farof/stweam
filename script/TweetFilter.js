(function (exports) {
  "use strict";
  
  exports.ITweetFilter = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit',
                    serialize: 'autoSerialize',
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
      
      _configElements: null,
      
      get configElements() {
        return this._configElements || (this._configElements = {});
      },
      
      set configElements(value) {
        this._configElements = value;
      },

      get inputTweets() {
        return this.input ? this.input.outputTweets : false;
      },

      set inputTweets(value) {
        throw new Error('read only');
      },

      get outputTweets() {
        return this.inputs.reduce(function (previous, current) {
          return previous.merge(current.outputTweets.filter(this.validate));
        }.bind(this), []);
      },

      set outputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name',
                              'type=type.type', 'config', 'position'],
      
      serialize: function () {
        var out = this.autoSerialize();
        out.inputs = this.inputs.map(function (input) {
          return input.uid;
        });
        return out;
      },

      validate: function (tweet) {
        console.log('unsaved filter: ', this);
        return false;
      },

      save: function () {
        this.validate = this.type.validator(this.config);
        return this;
      },
      
      getContentChildren: function () {
        return this.getItemContentChildren();
      }
    })
  );
  
  exports.TweetFilter = new Collection(ITweetFilter);
  
}(window));