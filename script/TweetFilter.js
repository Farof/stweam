(function (exports) {
  "use strict";
  
  exports.ITweetFilter = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit', serialize: 'workspaceItemSerialize' }, IWorkspaceItem),
    IHasInput,
    IHasOutput,
    Trait({
      initialize: function TweetFilter(options) {
        this.workspaceItemInit(options);
        
        this.param = TweetFilterType.items[this.param];
        this.operator = this.param.operators[this.operator || this.param.operator];
        this.configElements = {};

        if (typeof this.process === 'string') {
          this.process = Process.getById(this.process);
        } else if (!this.process) {
          this.process = Process.getByItem(this);
        }
        this.save();
        return this;
      },
      
      name: 'unamed filter',

      itemType: 'filter',

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

      get type() {
        return this.param;
      },

      set type(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'input=input.uid',
                              'param=param.type', 'operator=operator.type', 'value', 'position'],

      serialize: function () {
        return this.param.serialize.call(this, this.workspaceItemSerialize());
      },

      validate: function (tweet) {
        console.log('unsaved filter: ', this);
        return false;
      },

      savedConfig: {},

      save: function () {
        var
          check = this.operator.check,
          value = this.value,
          param = this.param.type,
          getParam;
        if (this.param.metadata) {
          getParam = function (tweet) {
            return tweet.metadata[param];
          };
        } else {
          getParam = function (tweet) {
            return tweet[param];
          };
        }
        this.validate = function (tweet) {
          return check(value, getParam(tweet.data));
        };
        this.savedConfig = this.type.saveConfig(this, {
          type: this.type.type
        });
        return this;
      },

      toWorkspaceElement: function () {
        var el;
        if (!this.workspaceElement) {
          this.workspaceElement = el = new WorkspaceElement(this);
        }
        return this.workspaceElement;
      },

      getContentChildren: function () {
        var children, child, operators, config;
        if (!this.contentChildren) {
          this.contentChildren = children = [];

          child = new Element('p', {
            'class': 'item-content-zone item-type',
            title: this.type.description || ''
          });
          child.appendChild(new Element('span', {
            'class': 'item-content-label item-type-label',
            text: 'filter by: '
          }));
          child.appendChild(new Element('span', {
            'class': 'item-content item-type-name',
            text: this.type.label
          }));
          children.push(child);


          operators = this.type.getOperatorsElement(this);
          children.push(operators);

          config = this.configElement = this.toConfigElement();
          children.push(config);
        }
        return this.contentChildren;
      },

      toConfigElement: function () {
        return this.operator.toConfigElement(this);
      },

      updated: function (type, value) {
        var previous, newValue;
        if (type === 'name') {
          this.name = value;
        } else if (type === 'operator') {
          this.operator = this.type.operators[value];
          previous = this.configElement;
          newValue = this.configElement = this.toConfigElement();
          this.contentElement.replaceChild(newValue, previous);
          this.save();
        } else if (type === 'value') {
          this.value = value;
          this.save();
        }
        if (this.process) {
          this.process.itemUpdated(type, this);
        }
      }
    })
  );
  
  exports.TweetFilter = ICollection.create(ITweetFilter);
  
}(window));