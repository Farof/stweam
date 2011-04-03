(function (exports) {
  
  exports.SelectLine = function (label, source, onchange, value, def) {
    var line, child, select, option, i, ln, choice;
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

    for (i = 0, ln = source.length; i < ln; i += 1) {
      choice = source[i];
      option = new Element('option', {
        'class': 'operator-option',
        text: choice.label,
        value: choice.type,
        title: choice.description
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