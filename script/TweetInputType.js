(function (exports) {
  "use strict";
  
  exports.ITweetInputType = Trait.compose(
    Trait({
      serialize: function (out) {
        return out || {};
      },
      
      toLibraryElement: function () {
        var el;
        if (!this.libraryElement) {
          el = new Element('p', {
            'class': 'library-item input-type',
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
  
  exports.TweetInputType = IMap.create(ITweetInputType);
  
  
  exports.TweetInputType.add({
    type: 'global',
    label: 'All sources',
    description: 'All tweets from all sources.',
    retrieve: function () {
      return Twitter.tweets;
    }
  });
  
}(window));