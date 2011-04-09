(function (exports) {
  "use strict";

  exports.IHasInput = Trait({
    hasInputs: true,
    
    inputTweets: Trait.required,
    
    _inputs: null,
    
    get inputs() {
      return this._inputs || (this._inputs = []);
    },
    
    set inputs(value) {
      this._inputs = value;
    },
    
    addInput: function (input) {
      if (input.hasOutputs) {
        this.inputs.include(input);
        input._addOutput(this);
        this.inputUpdated();
      }
      return this;
    },
    
    removeInput: function (input) {
      if (input.hasOutputs) {
        this.inputs.remove(input);
        input._removeOutput(this);
        this.inputUpdated();
      }
      return this;
    },
    
    get hasInput() {
      return this.inputs.length > 0;
    },
    
    clearInputs: function () {
      var i, ln;

      for (i = 0, ln = this.inputs.length; i < ln; i += 1) {
        this.removeInput(this.inputs[i]);
      }
      
      return this;
    },
    
    inputUpdated: function (type, input) {
      if (this.hasOutputs) {
        this.updateOutputs(type);
      }
      if (this.itemType === 'output') {
        this.type.refreshOutput(this);
      }
    }
  });

}(window));