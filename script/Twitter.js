(function (exports) {
  "use strict";
  
  exports.Twitter = {
    appName: 'tweb',
    
    get uid() {
      return uuid();
    },
    
    set uid(value) {
      throw new Error('read only');
    },
    
    get tweets() {
      return Tweet.items;
    },
    
    set tweets(value) {
      throw new Error('read only');
    },
    
    get tweetsId() {
      return this.tweets.map(function (tweet) {
        return tweet.id;
      });
    },
    
    set tweetsId(value) {
      throw new Error('read only');
    },
    
    status: {
      
    },
    
    includeTweets: function (tweets) {
      var ids = this.tweetsId;
      tweets.forEach(function (tweet) {
        if (ids.indexOf(tweet.id) < 0) {
          this.tweets.push(tweet);
        }
      }.bind(this));
    },
    
    deserialize: function (serializable) {
      //console.log('deserialize: ', serializable);
      var options, constructor, item;
      try {
        options = JSON.parse(serializable);
      } catch (e) {
        console.log(e.message, e);
        return null;
      }
      
      constructor = exports[options.constructorName];
      if (constructor) {
        if (options.uid) {
          item = constructor.getById(options.uid);
        }
        if (item) {
          return item;
        } else {
          item = constructor.from(options);
          return item;
        }
      }
      return options;
    },
    
    init: function () {
      var lastProcess;
      
      Twitter.load();
      
      lastProcess = this.load('config.lastProcess') || Process.items[0];
      if (lastProcess) {
        lastProcess.generate().loadInWorkspace();
      } else {
        console.log('no process to load');
      }
    },
    
    load: function () {
      this.storage.load.apply(this.storage, arguments);
    },
    
    save: function () {
      this.storage.save.apply(this.storage, arguments);
    },
    
    bootstrap: function () {
      Process.from({
        uid: '18',
        name: 'My first Process',
        constructorName: 'Process',
        items: ['{"uid":"15","constructorName":"TweetInput","name":"global input","process":"18","type":"global","position":{"left":93,"top":59}}',
                '{"uid":"16","constructorName":"TweetFilter","name":"author filter","process":"18","input":"15","type":"from_user","operator":"contains","value":"yozomist","position":{"left":252,"top":193}}',
                '{"uid":"17","constructorName":"TweetOutput","name":"DOM output","process":"18","input":"16","type":"DOM","position":{"left":434,"top":348},"outputInfo":{"node":"#list"}}']
      });
      
      Twitter.save();
      window.location = window.location;
    },
    
    storage: {
      get db() {
        return sessionStorage;
      },
      
      set db(value) {
        throw new Error('read only');
      },
      
      version: '1.0',
      
      structure: {
        processes: {
          keyPath: null,
          
          indexes: {
            name: { unique: false }
          }
        }
      },
      
      describe: function () {
        if (this.db.length) {
          console.dir(this.db);
        } else {
          console.log('db is empty');
        }
      },
      
      clear: function () {
        this.db.clear();
      },
      
      save: function (item, key) {
        if (arguments.length === 1) {
          this.saveItem(item);
        } else if (arguments.length === 2) {
          this.saveKey(key, item);
        } else {
          Process.items.forEach(function (item) {
            this.save(item);
          }.bind(this));
        }
      },
      
      saveItem: function (item) {
        if (item.constructor && item.constructorName && item.serialize && item.uid) {
          this.saveKey(item.constructorName + ':' + item.uid, JSON.stringify(item.serialize()));
        }
      },
      
      saveKey: function (key, value) {
        try {
          this.db.setItem(key, value);
        } catch (e) {
          console.log('error saving: ', e.message, e);
        }
      },
      
      load: function (key) {        
        var items = ['Process'], i, ln;
        
        if (key) {
          return this.loadKey(key);
        }
        
        for (key in this.db) {
          for (i = 0, ln = items.length; i < ln; i += 1) {
            if (key.indexOf(items[i] + ':') > -1) {
              return this.loadItem(items[i], this.db.getItem(key));
            }
          }
        }
      },
      
      loadItem: function (constructorName, options) {
        var constructor = window[constructorName];
        if (constructor && constructor.from) {
          try {
            options = JSON.parse(options);
            return constructor.from(options);
          } catch (e) {
            console.log('error loading item: ', constructorName, options, e.message, e);
          }
        } else {
          console.log('could not load item, no constructor found', constructorName, options);
        }
        return null;
      },
      
      loadKey: function (key) {
        try {
          return this.db.getItem(key);
        } catch (e) {
          console.log('error loading key: ', key);
          return null;
        }
      }
    },
    
    help: function () {
      document.getElementById('help').classList.toggle('hidden');
    }
  };
  
  document.addEventListener('keyup', function (e) {
    if (String.fromCharCode(e.keyCode).toLowerCase() === 'h') {
      exports.Twitter.help();
    }
  }, false);
  
}(window));