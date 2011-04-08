(function (exports) {
  "use strict";

  exports.IHasUUID = Trait({
    initUUID: function () {
      if (!this.uid) {
        this.uid = Twitter.uid;
      }
      return this;
    }
  });

}(window));