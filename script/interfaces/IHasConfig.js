(function (exports) {
  "use strict";

  exports.IHasConfig = Trait({
    _config: null,
    get config() {
      return this._config || (this._config = {});
    },
    set config (value) {
      this._config = value;
    },
    
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