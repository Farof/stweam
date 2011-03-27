(function (exports) {
  "use strict";
  
  exports.TweetList = function (filterForm, contentRoot) {
    this.filterForm = filterForm;
    this.filters = [];
    this.root = contentRoot;
    
    this.filterForm.addEventListener('submit', this.handleFormSubmit.bind(this), false);
    
    this.resetForm();
  };
  
  exports.TweetList.prototype = {
    constructor: exports.TweetList,
    
    resetForm: function () {
      while (this.filterForm.children[0]) {
        this.filterForm.removeChild(this.filterForm.children[0]);
      }
      
      var submit, add;
      
      submit = new Element('input', {
        class: 'filter-submit',
        type: 'submit',
        value: 'submit'
      });
      this.filterForm.appendChild(submit);
      
      add = new Element('button', {
        class: 'filter-add',
        value: 'add',
        text: 'Add filter'
      });
      this.filterForm.appendChild(add);
    },
    
    handleFormSubmit: function (e) {
      var
        t = e.explicitOriginalTarget,
        v = t.value;
      if (v === 'add') {
        this.addFilterParam(e);
      } else if (v === 'remove') {
        this.removeFilterParam(e);
      } else if (v === 'submit' || t.classList.contains('filter-value')) {
        this.computeFilter(true);
      } else {
        console.log('no action: ', v, e);
      }
    },
    
    addFilterParam: function (options) {
      var filter = new Filter(options);
      this.filters.push(filter);
      this.filterForm.appendChild(filter.toElement());
    },
    
    removeFilterParam: function (e) {
      var filter = e.explicitOriginalTarget.filter;
      this.filterForm.removeChild(filter.element);
      this.filters.splice(this.filters.indexOf(filter), 1);
    },
    
    computeFilter: function (apply) {
      console.log('compute: ', this.filterForm);
      
      this.filters.forEach(function (filter) {
        filter.saveState();
      });
      
      if (apply) {
        this.applyFilter();
      }
      return this;
    },
    
    get filterFuncs() {
      return this.filters.map(function (filter) {
        return filter.validate;
      });
    },
    
    set filterFuncs(value) {
      throw new Error('read only');
    },
    
    applyFilter: function () {
      Array.prototype.forEach.call(this.root.querySelectorAll('.tweet-box'), function (element) {
        var i, ln, tweet = element.tweet;
        if (!this.filterFuncs[0]) {
          element.style.display = 'block';
        } else {
          for (i = 0, ln = this.filterFuncs.length; i < ln; i += 1) {
            if (this.filterFuncs[i](tweet)) {
              element.style.display = 'block';
            } else {
              element.style.display = 'none';
              break;
            }
          }
        }
      }.bind(this));
      return this;
    },
    
    empty: function () {
      while (this.root.children[0]) {
        this.root.removeChild(this.root.children[0]);
      }
    },
    
    display: function (filter, compute) {
      var tweets = Twitter.tweets, tweet;
      for (tweet in tweets) {
        this.root.appendChild(tweets[tweet].toDebugElement());
      }
      
      if (filter) {
        if (compute) {
          this.computeFilter();
        }
        this.applyFilter();
      }
      
      return this;
    }
  };
  
}(window));