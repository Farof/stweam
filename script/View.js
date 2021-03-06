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
      
      _sources: null,
      get sources() {
        return this._sources || (this._sources = []);
      },
      set sources(value) {
        this._sources = value;
      },
      
      _tweets: null,
      get tweets() {
        return this._tweets || (this._tweets = []);
      },
      set tweets(value) {
        this._tweets = value;
      },
      
      get loaded() {
        return View.loadedItem === this;
      },
      
      initialize: function View(options) {
        this.setOptions(options);
        this.initUUID();
        
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
      
      hasProcess: function (process) {
        return this.sources.some(function (source) {
          return source.process === process;
        });
      },
      
      load: function () {
        var root = document.getElementById('views-item');
        if (!this.loaded) {
          if (View.loadedItem) {
            View.loadedItem.unload();
          }
          root.appendChild(this.toListElement());
          this.listElement.classList.remove('hidden');
          this.refreshSources();
          this.populate();
          this.loadProcesses();
          View.loadedItem = this;
          Twitter.save('config.lastView', this.uid);
        }
        return this;
      },
      
      unload: function () {
        if (this.loaded) {
          View.loadedItem = null;
        }
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
        var i, ln;
        this.tweets = this.sources.reduce(function (previous, current) {
          return previous.merge(current.generate());
        }, []);
        this.listElement.empty();
        for (i = 0, ln = this.tweets.length; i < ln; i += 1) {
          this.listElement.appendChild(this.tweets[i]);
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
        if (this.listElement) {
          this.listElement.dispose();
        }
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
      Twitter.storage.removeItem(item);
      Process.drawLoaded();
    }
  }));
  Object.defineProperties(View.items, IPropertyDispatcher);
  
}(window));