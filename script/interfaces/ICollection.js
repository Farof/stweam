(function (exports) {
  "use strict";

  exports.ICollection = function (Constructor) {
    return Trait({
      _items: null,
      
      get items() {
        return this._items || (this._items = []);
      },

      set items(value) {
        this._items = value;
      },
      
      getById: function (uid) {
        var i, ln;
        for (i = 0, ln = this.items.length; i < ln; i += 1) {
          if (this.items[i].uid === uid) {
            return this.items[i];
          }
        }
        return null;
      },
      
      add: function (options) {
        var item;
        Trait.create(Object.prototype, Constructor);
        item = Object.create(Object.prototype, Constructor);
        this.items.push(item);
        if (item.initialize) {
          item.initialize(options);
        }
        return item;
      },
      
      from: function (options) {
        var item = (options && options.uid) ? this.getById(options.uid) : null;
        if (!item) {
          item = this.add.apply(this, arguments);
        }
        return item;
      }
    });
  };
  exports.Collection = function (Constructor, trait) {
    return Object.create(Object.prototype, Trait.compose(ICollection(Constructor), (trait || Trait({}))))
  };

}(window));