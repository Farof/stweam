(function (exports) {
  "use strict";

  exports.ITweetOutput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit', serialize: 'workspaceItemSerialize' }, IWorkspaceItem),
    IHasInput,
    Trait({
      initialize: function TweetOutput(options) {
        this.workspaceItemInit(options);
        
        this.type = TweetOutputType.items[this.type];
        if (typeof this.process === 'string') {
          this.process = Process.getById(this.process);
        } else if (!this.process) {
          this.process = Process.getByItem(this);
        }
        
        return this;
      },
      
      name: 'unamed output',

      itemType: 'output',

      get inputTweets() {
        return this.input.outputTweets;
      },

      set inputTweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'input=input.uid', 'type=type.type', 'position'],

      serialize: function () {
        return this.type.serialize.call(this, this.workspaceItemSerialize());
      },

      generate: function () {
        this.type.generate.call(this);
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
        var children, child;
        if (!this.contentChildren) {
          this.contentChildren = children = [];

          child = new Element('p', {
            'class': 'item-content-zone item-type',
            title: this.type.description || ''
          });
          child.appendChild(new Element('span', {
            'class': 'item-content-label item-type-label',
            text: 'output: '
          }));
          child.appendChild(new Element('span', {
            'class': 'item-content item-type-name',
            text: this.type.label
          }));
          children.push(child);
        }
        return this.contentChildren;
      },

      updated: function (type) {
        if (this.process) {
          this.process.itemUpdated(type, this);
        }
      }
    })
  );
  
  exports.TweetOutput = ICollection.create(ITweetOutput);
  
}(window));