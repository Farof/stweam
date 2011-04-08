(function (exports) {
  "use strict";

  exports.ICollectionItem = Trait({
    itemType: Trait.required,
    
    toCollectionElement: function () {
      var el;
      if (!this.collectionElement) {
        el = new Element('p', {
          'class': ('collection-item ' + this.itemType),
          source: this,
          events: {
            click: function (e) {
              if (!this.clickTimer) {
                this.clickTimer = setTimeout(function () {
                  this.clickTimer = null;
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
        
        this.collectionTitleElement = new Element('span', {
          'class': 'title',
          text: this.name
        });
        el.appendChild(this.collectionTitleElement);
        
        el.appendChild(new Element('span', {
          'class': 'remove',
          text: '-',
          source: this,
          events: {
            click: function (e) {
              e.stop();
              this.source.dispose();
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
          'class': ('collection-item ' + this.itemType)
        });
        this.collectionEditElement.appendChild(new Element('input', {
          type: this.text,
          value: this.name || this.defaultName,
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
                  this.source.dispose();
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
      this.collectionElement.parentNode.replaceChild(this.toCollectionEditElement(), this.collectionElement);
      this.collectionEditElement.querySelector('input').focus();
    },
    
    uneditCollectionElement: function (input) {
      var value = input.value || this.defaultName;
      this.firstInit = false;
      this.name = value;
      this.collectionTitleElement.textContent = value;
      this.collectionEditElement.parentNode.replaceChild(this.collectionElement, this.collectionEditElement);
      this.save();
      this.dispatchProperty('name');
    },
  });

}(window));