(function (exports) {
  "use strict";

  exports.IMovable = Trait({
    isMovable: true,
    
    initPosition: function () {
      if (!this.position) {
        this.position = {
          x: 0,
          y: 0
        };
      }
    },
    
    dragPositionUpdated: function (x, y) {
      this.position.left = x;
      this.position.top = y;
    },
    
    dragEnd: Trait.required
  });

}(window));