(function (exports) {
  "use strict";
  
  exports.IView = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    ISerializable,
    
    Trait({
      name: 'unamed view',
      
      sources: [],
      tweets: [],
      
      initialize: function View(options) {
        this.setOptions(options);
        this.initUUID();
        
        this.refreshSources();
        
        document.getElementById('views').appendChild(this.toCollectionElement());
      },
      
      serializedProperties: ['uid', 'constructorName', 'name'],
      
      refreshSources: function () {
        this.sources = TweetOutput.items.filter(function (item) {
          return (item.type === 'DOM' || (item.type && item.type.type === 'DOM')) && 
            (item.config.view === this || item.config.view === this.uid);
        }.bind(this));
      },
      
      toCollectionElement: function () {
        var el;
        if (!this.collectionElement) {
          el = new Element('p', {
            'class': 'collection-item view',
            text: this.name,
            source: this,
            events: {
              click: function () {
                console.log(this, this.source);
                this.source.load();
              }
            }
          });

          this.collectionElement = el;
        }
        return this.collectionElement;
      },
      
      load: function () {
        var root = document.getElementById('views-item');
        if (!this.listElement || !root.hasChild(this.listElement)) {
          root.appendChild(this.toListElement());
          this.listElement.classList.remove('hidden');
          this.populate();
          this.loadProcesses();
        }
        return this;
      },
      
      unload: function () {
        if (this.listElement) {
          this.listElement.classList.add('hidden');
        }
      },
      
      loadProcesses: function () {
        var i, ln;
        for (i = 0, ln = this.sources.length; i < ln; i += 1) {
          this.sources[i].process.loadInWorkspace();
        }
      },
      
      get listID() {
        return 'tweet-list-' + this.uid;
      },
      
      set listID(value) {
        // fail silently
      },
      
      toListElement: function () {
        if (!this.listElement) {
          this.listElement = new Element('div', {
            id: this.listID,
            'class': 'tweet-list'
          });
        }
        return this.listElement;
      },
      
      populate: function () {
        var tweets = [], i, ln;
        for (i = 0, ln = this.sources.length; i < ln; i += 1) {
          tweets.merge(this.sources[i].generate());
        }
        this.tweets = tweets;
        this.listElement.empty();
        for (i = 0, ln = tweets.length; i < ln; i += 1) {
          this.listElement.appendChild(tweets[i]);
        }
      },
      
      sourceUpdated: function (source) {
        this.populate();
      },
      
      save: function () {
        Twitter.save(this);
      }
    })
  );
  
  exports.View = ICollection.create(IView);
  
}(window));