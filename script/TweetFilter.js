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
        
        if (!this.operator) {
          this.operator = this.type.operator;
        }
        
        return this;
      },
      
      name: 'unamed filter',

      itemType: 'filter',
      
      types: TweetFilterType,
      
      configElements: {},

      get inputTweets() {
        return this.input.outputTweets;
      },

      set inputTweets(value) {
        throw new Error('read only');
      },

      get outputTweets() {
        return this.inputTweets.filter(this.validate);
      },

      set outputTweets(value) {
        throw new Error('read only');
      },
      
      _operator: undefined,
      
      get operator() {
        return this._operator;
      },
      
      set operator(value) {
        var previous = this._operator ? this.toConfigElement() : null, newValue;
        this._operator = this.type.operators[value];
        if (previous) {
          newValue = this.configElement = this.toConfigElement();
          this.contentElement.replaceChild(newValue, previous);
        }
        this.save();
      },
      
      _value: undefined,
      
      get value() {
        return this._value;
      },
      
      set value(value) {
        this._value = value;
        this.save();
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'input=input.uid',
                              'type=type.type', 'operator=operator.type', 'value', 'position'],

      validate: function (tweet) {
        console.log('unsaved filter: ', this);
        return false;
      },

      savedConfig: {},

      save: function () {
        var
          check = this.operator.check,
          value = this.value,
          type = this.type.type,
          getType;
        if (this.type.metadata) {
          getType = function (tweet) {
            return tweet.metadata[type];
          };
        } else {
          getType = function (tweet) {
            return tweet[type];
          };
        }
        this.validate = function (tweet) {
          return check(value, getType(tweet.data));
        };
        this.savedConfig = this.type.saveConfig(this, {
          type: this.type.type
        });
        return this;
      },
      
      getContentChildren: function () {
        var existed = !!this.contentChildren, children = this.getItemContentChildren(), operators, config;
        
        if (!existed) {
          operators = this.type.getOperatorsElement(this);
          children.push(operators);

          config = this.configElement = this.toConfigElement();
          children.push(config);
        }
        
        return children;
      },
      
      toConfigElement: function () {
        return this.operator.toConfigElement(this);
      }
    })
  );
  
  exports.TweetFilter = ICollection.create(ITweetFilter);
  
}(window));