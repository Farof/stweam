(function (exports) {
  "use strict";
  
  exports.ITweetOutputType = Trait.compose(
    IInitializable,
    Trait({
      initialize: function TweetOutputType() {
        document.getElementById('output-type-list').appendChild(this.toLibraryElement());
        return this;
      },
      
      serialize: function (out) {
        return out || {};
      },
      
      toLibraryElement: function () {
        var el;
        if (!this.libraryElement) {
          el = new Element('p', {
            'class': 'library-item output-type',
            text: this.label,
            type: this,
            events: {
              click: function (e) {
                console.log(this.type);
              }
            }
          });
          this.libraryElement = el;
        }
        
        return this.libraryElement;
      }
    })
  );
  
  exports.TweetOutputType = IMap.create(ITweetOutputType);
  
  
  exports.TweetOutputType.add({
    type: 'DOM',
    label: 'DOM',
    description: 'Outputs as an HTML view.',
    
    serialize: function (serializable) {
      serializable = serializable || {};
      serializable.node = this.node;
      return serializable;
    },
    
    generate: function () {
      var
        element = new Element('div', {
          'class': 'tweet-list'
        }),
        root = document.querySelector(this.node);
      this.inputTweets.forEach(function (tweet) {
        element.appendChild(tweet.toDebugElement());
      });
      Element.empty(root);
      root.appendChild(element);
    }
  });
  
}(window));