(function (exports) {
  
  if (!Function.prototype.bind) {
    Object.defineProperty(Function.prototype, 'bind', {
      value: function (binded) {
        var args = arguments, func = this;
        return function () {
          return func.apply(binded, args);
        }
      }
    })
  }
  
}(window))