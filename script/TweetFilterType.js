(function (exports) {
  
  exports.TweetFilterType = function (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  };
  
  exports.TweetFilterType.prototype = {
    constructor: exports.TweetFilterType,
    
    serialize: function (serializable) {
      return serializable || {};
    },
    
    toLibraryElement: function () {
      var el;
      if (!this.libraryElement) {
        el = new Element('p', {
          'class': 'library-item filter-type',
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
  };
  
  exports.TweetFilterType.items = {};
  exports.TweetFilterType.add = function (options) {
    var item = new this(options);
    this.items[options.type] = item;
    document.getElementById('filter-type-list').appendChild(item.toLibraryElement());
    return item;
  };
  
  
  exports.TweetFilterType.add({
    type: 'created_at',
    label: 'Tweet date',
    description: 'Filter based on tweet date.',
    operators: ['is']
  });
  exports.TweetFilterType.add({
    type: 'from_user',
    label: 'Author',
    description: 'Filter by tweet author.',
    operators: ['is']
  });
  exports.TweetFilterType.add({
    type: 'result_type',
    label: 'Result type',
    description: 'Filter based on various metadata.',
    operators: ['is'],
    metadata: true,
    select: [
      {key: 'recent', label: 'Recent', init: true},
      {key: 'popular', label: 'Popular'}
    ]
  });
  exports.TweetFilterType.add({
    type: 'to_user',
    label: 'To user',
    description: 'Filter based on @user.',
    operators: ['is']
  });
  exports.TweetFilterType.add({
    type: 'text',
    label: 'Text',
    description: 'Filter based on tweet content.',
    operators: ['contains']
  });
  exports.TweetFilterType.add({
    type: 'iso_language_code',
    label: 'Language',
    description: 'Filter based on tweet language.',
    operators: ['is'],
    select: [
      {key: 'fr', label: 'French', init: true},
      {key: 'en', label: 'English'}
    ]
  });
  exports.TweetFilterType.add({
    type: 'source',
    label: 'Source',
    description: 'Filter based on source used to tweet.',
    operators: ['is']
  });
  
}(window));