(function (exports) {
  "use strict";

  exports.IHasOptions = Trait({
    setOptions: function (options) {
      var key;
      for (key in options) {
        this[key] = options[key];
      }
      return this;
    }
  });

}(window));