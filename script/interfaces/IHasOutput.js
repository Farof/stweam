(function (exports) {
  "use strict";

  exports.IHasOutput = Trait({
    hasOutputs: true,
    
    outputTweets: Trait.required,
    
    _outputs: null,
    
    get outputs() {
      return this._outputs || (this._outputs = []);
    },
    
    set outputs(value) {
      this._outputs = value;
    },
    
    _addOutput: function (output) {
      this.outputs.include(output);
    },
    
    _removeOutput: function (output) {
      this.outputs.remove(output);
    },
    
    get hasOutput() {
      return this.outputs.length > 0;
    },
    
    clearFromOutputs: function () {
      var i, ln;

      for (i = 0, ln = this.outputs.length; i < ln; i += 1) {
        this.outputs[i].removeInput(this);
      }
      
      return this;
    },
    
    updateOutputs: function (type) {
      var i, ln;

      for (i = 0, ln = this.outputs.length; i < ln; i += 1) {
        this.outputs[i].inputUpdated(type, this);
      }
      
      return this;
    }
  });

}(window));