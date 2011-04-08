(function (exports) {
  "use strict";

  exports.IPropertyDispatcher = Trait({
    dispatchableProperties: {},
    
    dispatchProperty: function (prop) {
      var callbacks = this.dispatchableProperties[prop], i, ln;
      
      if (callbacks) {
        for (i = 0, ln = callbacks.length; i < ln; i += 1) {
          callbacks[i](this[prop], prop);
        }
      }
      return this;
    },
    
    addPropertyListener: function (prop, callback) {
      if (!this.dispatchableProperties[prop]) {
        this.dispatchableProperties[prop] = [];
      }
      this.dispatchableProperties[prop].include(callback);
      return this;
    }
  });

}(window));