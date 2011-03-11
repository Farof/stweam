(function (exports) {
  
  exports.TweetFilterType = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  };
  
  exports.TweetFilterType.prototype = {
    constructor: exports.TweetFilterType,
    
    serialize: function (serializable) {
      return serializable || {};
    },
    
    toLibraryElement: function () {
      var el;
      if (!this.libraryElement) {
        el = new Element('p', {
          'class': 'library-item filter-type',
          text: this.label,
          type: this,
          events: {
            click: function (e) {
              console.log(this.type);
            }
          }
        });
        this.libraryElement = el;
      }
      return this.libraryElement;
    },
    
    getOperatorsElement: function (filter) {
      var el, child, select, key, operator, option, config;
      if (!filter.operatorsElement) {
        filter.operatorsElement = el = new Element('p', {
          'class': 'item-content-zone operator-choice-zone'
        });
        
        child = new Element('span', {
          'class': 'item-content-label operator-choice-label',
          text: 'operator: '
        });
        el.appendChild(child);
        
        select = new Element('select', {
          'class': 'item-content operator-select'
        });
        
        for (key in this.operators) {
          operator = this.operators[key];
          option = new Element('option', {
            'class': 'operator-option',
            text: operator.label,
            value: operator.type,
            title: operator.description,
            events: {
              click: function (e) {
                if (this.value !== filter.operator.type) {
                  filter.updated('operator', this.value);
                }
              }
            }
          });
          select.appendChild(option);
        }
        if (filter.operator.type) {
          select.value = filter.operator.type;
        }
        el.appendChild(select);
      }
      return el;
    }
  };
  
  exports.TweetFilterType.items = {};
  exports.TweetFilterType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    document.getElementById('filter-type-list').appendChild(item.toLibraryElement());
    return item;
  };
  
  
  exports.TweetFilterType.add({
    type: 'created_at',
    label: 'Tweet date',
    description: 'Filter based on tweet date.',
    operators: ['is']
  });
  exports.TweetFilterType.add({
    type: 'from_user',
    label: 'Author username',
    description: 'Filter by tweet author.',
    
    operator: 'is',
    operators: {
      is: {
        type: 'is',
        label: 'is',
        description: 'exact username match (case insensitive)',

        check: function (filter, tweet) {
          return tweet.toLowerCase() === filter.toLowerCase();
        },
        
        toConfigElement: function (filter) {
          var config = filter.configElements[this.type], child;
          if (!config) {
            config = filter.configElements[this.type] = new Element('div', {
              'class': 'item-config'
            });
          }
          return config;
        }
      },
      contains: {
        type: 'contains',
        label: 'contains',
        description: 'string found in username (case insensitive)',
        
        check: function (filter, tweet) {
          return tweet.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        },
        
        toConfigElement: function (filter) {
          var config = filter.configElements[this.type], child, child2;
          if (!config) {
            config = filter.configElements[this.type] = new Element('div', {
              'class': 'item-content-zone item-config'
            });
            
            child = new Element('p', {
              'class': 'item-config-line'
            });
            config.appendChild(child);
            
            child2 = new Element('input', {
              type: 'text',
              placeholder: 'filter'
            });
            if (filter.operator.type === this.type) {
              child2.setAttribute('value', filter.value);
            }
            child.appendChild(child2);
          }
          return config;
        }
      }
    }
  });
  exports.TweetFilterType.add({
    type: 'result_type',
    label: 'Result type',
    description: 'Filter based on various metadata.',
    operators: ['is'],
    metadata: true,
    select: [
      {key: 'recent', label: 'Recent', init: true},
      {key: 'popular', label: 'Popular'}
    ]
  });
  exports.TweetFilterType.add({
    type: 'to_user',
    label: 'To user',
    description: 'Filter based on @user.',
    operators: ['is']
  });
  exports.TweetFilterType.add({
    type: 'text',
    label: 'Text',
    description: 'Filter based on tweet content.',
    operators: ['contains']
  });
  exports.TweetFilterType.add({
    type: 'iso_language_code',
    label: 'Language',
    description: 'Filter based on tweet language.',
    operators: ['is'],
    select: [
      {key: 'fr', label: 'French', init: true},
      {key: 'en', label: 'English'}
    ]
  });
  exports.TweetFilterType.add({
    type: 'source',
    label: 'Source',
    description: 'Filter based on source used to tweet.',
    operators: ['is']
  });
  
}(window));