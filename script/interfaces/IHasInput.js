(function (exports) {
  "use strict";

  exports.IHasInput = Trait({
    hasInput: true,
    
    inputTweets: Trait.required,
    
    _input: undefined,
    
    get input() {
      return this._input;
    },
    
    set input(value) {
      if (this._input) {
        this._input.output = null;
      }
      this._input = value;
      if (this._input) {
        this._input.output = this;
      }
      if (this.process) {
        this.inputUpdated();
        this.process.drawCanvas();
      }
    },
    
    inputUpdated: function (type, input) {
      if (this.output) {
        this.output.inputUpdated(type, input);
      }
      if (this.itemType === 'output') {
        this.type.refreshOutput(this)
      }
    }
  });

}(window));