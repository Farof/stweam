(function (exports) {
  "use strict";
  
  exports.ITweet = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    ISerializable,
    Trait({
      initialize: function (options) {
        this.setOptions(options);
        this.initUUID();
        return this;
      },
      
      serializedProperties: ['uid', 'data'],
      
      toElement: function () {
        var element, tweet, userName, data = this.data;
        if (!this.element) {
          element = new Element('div', {
            'class': 'tweet-box',
            tweet: this
          });

          userName = new Element('p', {
            'class': 'tweet-author',
            text: data.from_user + ':'
          });
          element.appendChild(userName);

          tweet = new Element('p', {
            'class': 'tweet',
            text: data.text
          });
          element.appendChild(tweet);

          this.element = element;
        }
        return this.element;
      },

      toDebugElement: function () {
        var element, key, data = this.data;
        if (!this.debugElement) {
          element = new Element('div', {
            'class': 'tweet-box',
            tweet: this
          });

          for (key in data) {
            element.appendChild(new Element('p', {
              'class': 'tweet-data tweet-' + key,
              text: key + ': ' + data[key]
            }));
          }
          this.debugElement = element;
        }
        return this.debugElement;
      }
    })
  );
  
  
  exports.Tweet = ICollection.create(ITweet);
  
}(window));