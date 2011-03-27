(function (exports) {
  "use strict";
  
  exports.ITweetOperatorType = Trait.compose(
    ISerializable,
    Trait({
      serializedProperties: ['type', 'label'],
      
      serialize: function () {
        return {
          type: this.type,
          label: this.label
        };
      },

      getContentChildren: function (filter, param) {
        var children;
        if (!filter.typeContentChildren) {
          filter.typeContentChildren = children = [];
        }
        return filter.typeContentChildren;
      }
    })
  );
  
  
  exports.TweetOperatorType = IMap.create(ITweetOperatorType);
  
  
  exports.TweetOperatorType.add({
    type: 'is',
    label: 'is',
    description: 'Exact match.',
    
    check: function (filterValue, tweetValue) {
      return tweetValue === filterValue;
    }
  });
  exports.TweetOperatorType.add({
    type: 'contains',
    label: 'contains',
    description: 'Value is contained into tweet matched property.',
    
    check: function (filterValue, tweetValue) {
      return tweetValue.indexOf(filterValue) > -1;
    }
  });
  
}(window));