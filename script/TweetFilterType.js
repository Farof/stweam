(function (exports) {
  "use strict";
  
  exports.ITweetFilterType = Trait.compose(
    IType,
    
    Trait({
      typeGroup: 'filter',
      typeGroupConstructor: 'TweetFilter',
      
      getOperatorsElement: function (filter) {
        var el, child, select, key, operator, option;
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
            'class': 'item-content operator-select',
            events: {
              change: function () {
                filter.updated('operator', this.value);
              }
            }
          });

          for (key in this.operators) {
            operator = this.operators[key];
            option = new Element('option', {
              'class': 'operator-option',
              text: operator.label,
              value: operator.type,
              title: operator.description
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
    })
  );
  
  exports.TweetFilterType = IMap.create(ITweetFilterType);
  
  
  
  exports.TweetFilterType.add({
    type: 'from_user',
    label: 'Author username',
    description: 'Filter by tweet author.',
    
    toConfigElement: function (item) {
      return new ConfigElement(
        new SelectLine('operator: ', this.operators, function (e) {
          item.config.operator = this.value;
          item.updated('operator');
        }, item.config.operator, this.operator),
        
        new Input(function (e) {
          item.config.value = this.value;
          item.updated('value');
        }, item.config.value, '')
      );
    },
    
    validator: function (config) {
      return function (tweet) {
        return this.operators[config.operator].check(config.value, tweet.data[this.type]);
      }.bind(this);
    },
    
    operator: 'contains',
    
    operators: {
      is: {
        type: 'is',
        label: 'is',
        description: 'exact username match (case insensitive)',

        check: function (filter, tweet) {
          return tweet.toLowerCase() === filter.toLowerCase();
        }
      },
      contains: {
        type: 'contains',
        label: 'contains',
        description: 'string found in username (case insensitive)',
        
        check: function (filter, tweet) {
          return tweet.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }
      }
    }
  });
  
  exports.TweetFilterType.add({
    type: 'text',
    label: 'Text',
    description: 'Filter based on tweet content.',
    
    toConfigElement: function (item) {
      return new ConfigElement(
        new SelectLine('operator: ', this.operators, function (e) {
          item.config.operator = this.value;
          item.updated('operator');
        }, item.config.operator, this.operator),
        
        new Input(function (e) {
          item.config.value = this.value;
          item.updated('value');
        }, item.config.value, '')
      );
    },
    
    validator: function (config) {
      return function (tweet) {
        return this.operators[config.operator].check(config.value, tweet.data[this.type]);
      }.bind(this);
    },
    
    operator: 'contains',
    
    operators: {
      is: {
        type: 'is',
        label: 'is',
        description: 'exact tweet match (case insensitive)',

        check: function (filter, tweet) {
          return tweet.toLowerCase() === filter.toLowerCase();
        }
      },
      contains: {
        type: 'contains',
        label: 'contains',
        description: 'string found in tweet (case insensitive)',
        
        check: function (filter, tweet) {
          return tweet.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }
      }
    }
  });
  
  /*
  exports.TweetFilterType.add({
    type: 'created_at',
    label: 'Tweet date',
    description: 'Filter based on tweet date.',
    operators: ['is']
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
  */
  
}(window));