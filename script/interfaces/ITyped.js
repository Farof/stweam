(function (exports) {
  "use strict";

  exports.ITyped = Trait({
    types: Trait.required,
    
    _type: null,
    
    get type() {
      return this._type;
    },
    
    set type(value) {
      this._type = this.types.items[value];
    }
  });

}(window));