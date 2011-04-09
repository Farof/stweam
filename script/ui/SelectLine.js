(function (exports) {
  
  exports.SelectLine = function (label, source, onchange, value, def, options) {
    var line, child, select, option, i, ln, choice;
    options = options || {};
    
    line = new Element('p', {
      'class': 'item-config-line'
    });
    
    child = new Element('span', {
      'class': 'item-content-label',
      text: label
    });
    line.appendChild(child);
    
    select = new Element('select', {
      'class': 'item-content operator-select',
      events: {
        change: onchange
      }
    });
    line.appendChild(select);

    this.populate(source, select, onchange, value, def);
    
    if (options.datasource) {
      options.datasource.addPropertyListener('length', function () {
        this.populate(options.onDatasourceChange(options.datasource), select, onchange, select.value, def);
      }.bind(this));
    }
    
    return line;
  };
  
  SelectLine.prototype.populate = function (source, select, onchange, value, def) {
    var i, ln, choice, option;
    
    select.empty();
    
    for (i = 0, ln = source.length; i < ln; i += 1) {
      choice = source[i];
      
      option = new Element('option', {
        'class': 'operator-option',
        text: choice.label,
        value: choice.type,
        title: choice.description
      });
      
      if (choice.bind && choice.bind.addPropertyListener) {
        choice.bind.addPropertyListener(choice.bindProp, function (value) {
          option.textContent = value;
        });
      }
      
      select.appendChild(option);
    }
    
    if (value) {
      select.value = value;
    } else {
      select.value = def;
      onchange.call({ value: def });
    }
  };
  
}(window))