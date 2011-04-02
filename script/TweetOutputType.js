(function (exports) {
  "use strict";
  
  exports.ITweetOutputType = Trait.compose(
    Trait.resolve({ serializedProperties: undefined }, IType),
    
    Trait({
      typeGroup: 'output',
      typeGroupConstructor: 'TweetOutput',

      serializedProperties: ['outputInfo'],
      
      generate: Trait.required
    })
  );
  
  exports.TweetOutputType = IMap.create(ITweetOutputType);
  
  
  exports.TweetOutputType.add({
    type: 'DOM',
    label: 'DOM',
    description: 'Outputs as an HTML view.',
    
    configType: 'input',
    
    operators: null,
    
    placeholder: 'dom selector',
    
    getInputValue: function () {
      return this.outputInfo.node;
    },
    
    sendNewConfig: function (type, selector) {
      this.updated('outputInfo', {
        node: selector
      });
    },
    
    generate: function () {
      var
        element = new Element('div', {
          'class': 'tweet-list'
        }),
        root = document.querySelector(this.outputInfo.node),
        input = this.inputTweets;
        
      if (root) {
        if (input) {
          input.forEach(function (tweet) {
            element.appendChild(tweet.toElement());
          });
        }
        Element.empty(root);
        root.appendChild(element);
      } else {
        console.log('DOM output has no node: ', this.node, this);
      }
    }
  });
  
}(window));