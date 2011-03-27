(function (exports) {
  "use strict";
  
  exports.TweetInput = function TweetInput(options) {
    var key;
    for (key in options) {
      this[key] = options[key];
    }
    if (!this.uid) {
      this.uid = Twitter.uid;
    }
    if (!this.position) {
      this.position = {
        x: 0,
        y: 0
      };
    }
    this.type = TweetInputType.items[this.type];
    if (typeof this.process === 'string') {
      this.process = Process.getById(this.process);
    } else if (!this.process) {
      this.process = Process.getByItem(this);
    }
  };
  
  exports.TweetInput.prototype = {
    constructor: exports.TweetInput,
    
    name: 'unamed input',
    
    itemType: 'input',
    
    get tweets() {
      return this.type.retrieve.call(this);
    },
    
    set tweets(value) {
      throw new Error('read only');
    },
    
    serialize: function () {
      return this.type.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        type: this.type.type,
        position: this.position
      });
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
  };
  
  exports.TweetInput.items = [];
  exports.TweetInput.getById = function (uid) {
    var i, ln;
    for (i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.TweetInput.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.TweetInput.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));