(function (exports) {
  "use strict";

  exports.IHasConfig = Trait({
    config: {},
    
    toConfigElement: function () {
      if (!this.configElement) {
        this.configElement = this.type.toConfigElement(this);
      }
      return this.configElement;
    },
    
    saveConfig: function () {
      console.log('save');
    }
  });

}(window));