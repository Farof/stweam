(function (exports) {
  "use strict";
  
  exports.IView = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    Trait.resolve({ serialize: 'autoSerialize' }, ISerializable),
    IPropertyDispatcher,
    IDisposable,
    ICollectionItem,
    
    Trait({
      defaultName: 'unamed view',
      itemType: 'view',
      
      sources: [],
      tweets: [],
      
      get loaded() {
        return this.listElement && this.listElement.parentNode;
      },
      
      initialize: function View(options) {
        this.setOptions(options);
        this.initUUID();
        
        this.refreshSources();
        
        document.getElementById('views').appendChild(this.toCollectionElement());
      },
      
      serializedProperties: ['uid', 'constructorName', 'name'],
      
      serialize: function () {
        var out = this.autoSerialize();
        out.collectionIndex = View.items.indexOf(this);
        return out;
      },
      
      refreshSources: function () {
        this.sources = TweetOutput.items.filter(function (item) {
          return (item.type === 'DOM' || (item.type && item.type.type === 'DOM')) && 
            (item.config.view === this || item.config.view === this.uid);
        }.bind(this));
      },
      
      load: function () {
        var root = document.getElementById('views-item');
        if (!this.listElement || !root.hasChild(this.listElement)) {
          root.empty().appendChild(this.toListElement());
          this.listElement.classList.remove('hidden');
          this.populate();
          this.loadProcesses();
          Twitter.save('config.lastView', this.uid);
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
        Process.unloadAll();
        for (i = 0, ln = this.sources.length; i < ln; i += 1) {
          this.sources[i].process.load();
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
      },
      
      dispose: function () {
        this.dispatchableProperties = null;
        this.collectionElement.dispose();
        View.removeItem(this);
        return this;
      }
    })
  );
  
  exports.View = new Collection(IView, Trait({
    createNew: function () {
      var item = this.add();
      this.items.dispatchProperty('length');
      Process.drawLoaded();
      Twitter.save();
      item.firstInit = true;
      item.editCollectionElement();
    },
    
    removeItem: function (item) {
      this.items.remove(item);
      this.items.dispatchProperty('length');
      Process.drawLoaded();
      Twitter.storage.removeItem(item);
    }
  }));
  Object.defineProperties(View.items, IPropertyDispatcher);
  
}(window));