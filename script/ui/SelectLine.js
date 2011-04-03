(function (exports) {
  
  exports.SelectLine = function (label, source, onchange, value, def) {
    var line, child, select, option, key, operator;
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

    for (key in source) {
      operator = source[key];
      option = new Element('option', {
        'class': 'operator-option',
        text: operator.label,
        value: operator.type,
        title: operator.description
      });
      select.appendChild(option);
    }
    
    if (value) {
      select.value = value;
    } else {
      select.value = def;
      onchange.call({ value: def });
    }
    
    return line;
  };
  
}(window))