(function (exports) {
  
  exports.Input = function (onchange, value, def) {
    var line, child;
    
    line = new Element('p', {
      'class': 'item-config-line'
    });
    
    child = new Element('input', {
      type: 'text',
      placeholder: 'filter',
      events: {
        change: onchange
      }
    });
    if (value) {
      child.setAttribute('value', value);
    } else {
      child.setAttribute('value', def);
      onchange.call({ value: def });
    }
    line.appendChild(child);
    
    return line;
  };
  
}(window));