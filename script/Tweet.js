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
        var element, avatar, tweet, userName, data = this.data, key, mutators, i, ln;
        if (!this.element) {
          element = new Element('div', {
            'class': 'tweet-box',
            tweet: this
          });
          
          avatar = new Element('img', {
            'class': 'tweet-author-image',
            src: data.profile_image_url
          });
          element.appendChild(avatar);

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

          for (key in Tweet.Mutators) {
            mutators = Tweet.Mutators[key];
            for (i = 0, ln = mutators.length; i < ln; i += 1) {
              mutators[i](data[key], element);
            };
          }

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
  
  
  exports.Tweet = new Collection(ITweet);
  
  exports.Tweet.Mutators = {
    text: [
      function (text, element) {
        var
          p = element.querySelector('.tweet'),
          // regexp from John Gruber: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
          reg = new RegExp(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`\!()\[\]{};:'"\.,<>\?]))/g);
        
        p.innerHTML = p.innerHTML.replace(reg, '<a href="$1">$1</a>', 'g');
      },
      
      function (text, element) {
        var
          p = element.querySelector('.tweet'),
          reg = new RegExp(/(?:\s)((?:@((?:[a-zA-Z0-9\-_]+))))/g);
        
        p.innerHTML = p.innerHTML.replace(reg, ' <a href="https://twitter.com/$2">$1</a>', 'g');
      },
      
      function (text, element) {
        var
          p = element.querySelector('.tweet'),
          reg = new RegExp(/((?:#[\w]+))/g);
        
        p.innerHTML = p.innerHTML.replace(reg, ' <a href="https://twitter.com/#!/search?q=$1">$1</a>', 'g');
      }
    ]
  };
  
}(window));