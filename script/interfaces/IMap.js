(function (exports) {
  "use strict";

  exports.IMap = function (Constructor) {
    return Trait({
      items: {},
      
      add: function (options) {
        var item, trait = Trait.override(
          Trait(options),
          Constructor
        );
        Trait.create(Object.prototype, trait);
        item = Object.create(Object.prototype, trait);
        this.items[options.type] = item;
        if (item.initialize) {
          item.initialize(options);
        }
        return item;
      }
    });
  };
  exports.IMap.create = function (Constructor) {
    return Object.create(Object.prototype, IMap(Constructor));
  };

}(window));