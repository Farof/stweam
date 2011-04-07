(function (exports) {
  "use strict";
  
  exports.IView = Trait.compose(
    IInitializable,
    IHasOptions,
    IHasUUID,
    Trait.resolve({ serialize: 'autoSerialize' }, ISerializable),
    IPropertyDispatcher,
    IDisposable,
    
    Trait({
      defaultName: 'unamed view',
      
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
      
      toCollectionElement: function () {
        var el;
        if (!this.collectionElement) {
          el = new Element('p', {
            'class': 'collection-item view',
            text: this.name,
            source: this,
            events: {
              click: function (e) {
                if (!this.clickTimer) {
                  this.clickTimer = setTimeout(function () {
                    this.clickTimer = null;
                    console.log(this, this.source);
                    this.source.load();
                  }.bind(this), 200);
                }
              },
              dblclick: function (e) {
                clearTimeout(this.clickTimer);
                this.source.editCollectionElement();
              }
            }
          });
          
          el.appendChild(new Element('span', {
            'class': 'remove',
            text: '-',
            source: this,
            events: {
              click: function () {
                View.removeItem(this.source);
              }
            }
          }));

          this.collectionElement = el;
        }
        return this.collectionElement;
      },
      
      toCollectionEditElement: function () {
        if (!this.collectionEditElement) {
          this.collectionEditElement = new Element('p', {
            'class': 'collection-item view'
          });
          this.collectionEditElement.appendChild(new Element('input', {
            type: this.text,
            value: this.name,
            source: this,
            events: {
              blur: function () {
                this.source.uneditCollectionElement(this);
              },
              keydown: function (e) {
                if (e.keyCode === 13) {
                  this.source.uneditCollectionElement(this);
                } else if (e.keyCode === 27) {
                  if (this.source.firstInit) {
                    this.blur();
                    View.removeItem(this.source);
                  } else {
                    this.value = this.source.name;
                    this.source.uneditCollectionElement(this);
                  }
                }
              }
            }
          }))
        }
        return this.collectionEditElement;
      },
      
      editCollectionElement: function () {
        this.firstInit = false;
        this.collectionElement.parentNode.replaceChild(this.toCollectionEditElement(), this.collectionElement);
        this.collectionEditElement.querySelector('input').focus();
      },
      
      uneditCollectionElement: function (input) {
        var value = input.value || this.defaultName;
        this.name = value;
        this.collectionElement.textContent = value;
        this.collectionEditElement.parentNode.replaceChild(this.collectionElement, this.collectionEditElement);
        this.save();
        this.dispatchProperty('name');
      },
      
      load: function () {
        var root = document.getElementById('views-item');
        if (!this.listElement || !root.hasChild(this.listElement)) {
          root.appendChild(this.toListElement());
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
      },
      
      dispose: function () {
        this.dispatchableProperties = null;
        this.collectionElement.dispose();
        return this;
      }
    })
  );
  
  exports.View = ICollection.create(IView, Trait({
    createNew: function () {
      var item = this.add();
      this.items.dispatchProperty('length');
      Process.loadedItem.drawCanvas();
      Twitter.save();
      item.firstInit = true;
      item.editCollectionElement();
    },
    
    removeItem: function (item) {
      item.dispose();
      this.items.remove(item);
      this.items.dispatchProperty('length');
      Process.loadedItem.drawCanvas();
      Twitter.storage.removeItem(item);
    }
  }));
  Object.defineProperties(View.items, IPropertyDispatcher);
  
}(window));