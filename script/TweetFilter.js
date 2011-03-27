(function (exports) {
  "use strict";
  
  exports.TweetFilter = function TweetFilter(options) {
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
    
    this.param = TweetFilterType.items[this.param];
    this.operator = this.param.operators[this.operator || this.param.operator];
    this.configElements = {};
    
    if (typeof this.process === 'string') {
      this.process = Process.getById(this.process);
    } else if (!this.process) {
      this.process = Process.getByItem(this);
    }
    this.save();
  };
  
  exports.TweetFilter.prototype = {
    constructor: exports.TweetFilter,
    
    name: 'unamed filter',
    
    itemType: 'filter',
    
    get tweets() {
      return this.input.tweets.filter(this.validate);
    },
    
    set tweets(value) {
      throw new Error('read only');
    },
    
    get type() {
      return this.param;
    },
    
    set type(value) {
      throw new Error('read only');
    },
    
    serialize: function () {
      return this.param.serialize.call(this, {
        uid: this.uid,
        constructorName: this.constructor.name,
        name: this.name,
        input: (typeof this.input !== 'string') ? this.input.uid : this.input,
        param: this.param.type,
        operator: this.operator.type,
        value: this.value,
        position: this.position
      });
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
  };
  
  exports.TweetFilter.items = [];
  exports.TweetFilter.getById = function (uid) {
    var i, ln;
    for (i = 0, ln = this.items.length; i < ln; i += 1) {
      if (this.items[i].uid === uid) {
        return this.items[i];
      }
    }
    return null;
  };
  exports.TweetFilter.add = function (options) {
    var item = new this(options);
    this.items.push(item);
    return item;
  };
  exports.TweetFilter.from = function (options) {
    var item = (options && options.uid) ? this.getById(options.uid) : null;
    if (!item) {
      item = this.add.apply(this, arguments);
    }
    return item;
  };
  
}(window));