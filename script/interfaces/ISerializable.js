(function (exports) {
  "use strict";

  exports.ISerializable = Trait({
    serializedProperties: Trait.required,
    
    get constructorName() {
      return this.initialize.name;
    },
    
    set constructorName(value) {
      // do nothing
    },
    
    serialize: function (out, props) {
      // refaire le name=path
      var props = (props || this.serializedProperties), prop, propName, propPath, propValue, i, ln;
      out = out || {};
      for (i = 0, ln = props.length; i < ln; i += 1) {
        prop = props[i].split('=');
        propName = prop[0]
        propPath = (prop[1] || propName).split('.');
        propValue = this;
        while (propValue && propPath.length > 0) {
          propValue = propValue[propPath.shift()];
        }
        out[propName] = propValue;
      }
      return out;
    }
  });

}(window));