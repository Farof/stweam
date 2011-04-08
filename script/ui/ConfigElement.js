(function (exports) {
  
  exports.ConfigElement = function () {
    var config = new Element('div', {
      'class': 'item-content-zone item-config'
    }), i, ln;
    
    for (i = 0, ln = arguments.length; i < ln; i += 1) {
      config.appendChild(arguments[i]);
    }
    
    return config;
  };
  
}(window));