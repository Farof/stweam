(function (exports) {
  "use strict";

  exports.IHasOptions = Trait({
    setOptions: function (options) {
      Object.merge(this, options);
    }
  });

}(window));