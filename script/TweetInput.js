(function (exports) {
  "use strict";
  
  exports.ITweetInput = Trait.compose(
    Trait.resolve({ initialize: 'workspaceItemInit', serialize: 'workspaceItemSerialize' }, IWorkspaceItem),
    IHasOutput,
    Trait({
      initialize: function TweetInput(options) {
        this.workspaceItemInit(options);
        
        this.type = TweetInputType.items[this.type];
        if (typeof this.process === 'string') {
          this.process = Process.getById(this.process);
        } else if (!this.process) {
          this.process = Process.getByItem(this);
        }
        return this;
      },

      name: 'unamed input',

      itemType: 'input',

      get tweets() {
        return this.type.retrieve.call(this);
      },

      set tweets(value) {
        throw new Error('read only');
      },
      
      serializedProperties: ['uid', 'constructorName', 'name', 'type=type.type', 'position'],

      serialize: function () {
        return this.type.serialize.call(this, this.workspaceItemSerialize());
      },

      toWorkspaceElement: function () {
        var el, title, content;
        if (!this.workspaceElement) {
          this.workspaceElement = el = new WorkspaceElement(this);
          title = el.querySelector('.workspace-title');
          content = el.querySelector('.workspace-content');
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
            text: 'input: '
          }));
          child.appendChild(new Element('span', {
            'class': 'item-content item-type-name',
            text: this.type.label
          }));
          children.push(child);
        }
        return this.contentChildren;
      },

      updated: function (type, value) {
        if (type === 'name') {
          this.name = value;
        }
        if (this.process) {
          this.process.itemUpdated(type, this);
        }
      }
    })
  );
  
  exports.TweetInput = ICollection.create(ITweetInput);
  
}(window));