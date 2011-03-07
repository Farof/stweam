(function (exports) {
  
  exports.Filter = function (options) {
    this.options = options;
  };
  
  exports.Filter.prototype = {
    constructor: exports.Filter,
    
    saveState: function () {
      var
      param = this.params.value,
      operator = this.operators.value,
      value = this.value.value,
      check = (this.constructor.operators.filter(function (op) {
        return op.key === operator;
      }))[0].check(value);
      
      this.validate = function (tweet) {
        return check(tweet.data[param]);
      };
    },
    
    validate: function (value) {
      console.log('unsaved filter: ', this, this.toElement());
      return false;
    },
    
    handleParamChange: function (e) {
      console.log('change filter param: ', e, e.target);
    },
    
    updateOperatorList: function () {
      var
      param = this.params.options.item(this.params.selectedIndex).param,
      type = param.type,
      types, i, ln;
      for (i = 0, ln = this.operators.options.length; i < ln; i += 1) {
        if (this.operators.options.item(i).operator.types.indexOf(type) > -1) {
          this.operators.options.item(i).classList.remove('disabled');
        } else {
          this.operators.options.item(i).classList.add('disabled');
        }
      }
      this.resetOperator();
    },
    
    resetOperator: function (option) {
      if (option && this.options && this.options.operator) {
        this.operators.value = this.options.operator;
      } else {
        this.operators.value = this.params.options.item(this.params.selectedIndex).param.operator;
      }
    },
    
    toElement: function () {
      var element, rm, params, operators, value;
      if (!this.element) {
        element = new Element('p', {
          class: 'filter-option',
          filter: this
        });
        
        rm = new Element('button', {
          class: 'filter-remove',
          value: 'remove',
          text: 'Remove filter',
          filter: this
        });
        element.appendChild(rm);
        
        params = this.params = new Element('select', {
          class: 'filter-param-list'
        });
        this.constructor.params.forEach(function (param) {
          var el = new Element('option', {
            class: 'filter-param',
            value: param.key,
            text: param.label,
            param: param,
            events: {
              // gérer le changement au clavier
              click: this.handleParamChange.bind(this)
            }
          });
          params.add(el, null);
        }.bind(this));
        params.value = this.options.param || 'text';
        element.appendChild(params);
        
        operators = this.operators = new Element('select', {
          class: 'filter-operator-list'
        });
        this.constructor.operators.forEach(function (operator) {
          var el = new Element('option', {
            class: 'filter-operator',
            value: operator.key,
            text: operator.label,
            operator: operator
          });
          operators.add(el, null);
        }.bind(this));
        this.updateOperatorList();
        this.resetOperator(true);
        element.appendChild(operators);
        
        value = this.value = new Element('input', {
          class: 'filter-value',
          type: 'text',
          value: (this.options && this.options.value) ? this.options.value : '' 
        });
        element.appendChild(value);
        
        this.element = element;
      }
      return this.element;
    }
  };
  
}(window));