(function (exports) {
  "use strict";
  
  exports.WorkspaceElement = function WorkspaceElement(source) {
    var el, title, icon, content, saveTitle;
    
    el = new Element('div', {
      'class': 'workspace-item item-type-' + source.itemType + ' type-' + source.type.type,
      source: source,
      events: {
        mousedown: function (e) {
          this.source.handleMousedown(e);
        }
      }
    });
    el.style.left = source.position.left + 'px';
    el.style.top = source.position.top + 'px';
    el.style.position = 'absolute';
    
    title = new Element('p', {
      'class': 'workspace-item-title-zone',
      source: source
    });
    saveTitle = title.save = function (e) {
      var value = this.querySelector('.workspace-item-title-input').value;
      this.querySelector('.workspace-item-title').textContent = value;
      source.updated('name', value);
      this.classList.remove('editing');
      source.process.drawCanvas(e);
    }.bind(title);
    el.appendChild(title);
    
    title.appendChild(new Element('span', {
      'class': 'workspace-item-title',
      text: source.name,
      source: source,
      events: {
        click: function (e) {
          if (!this.parentNode.parentNode.dragged) {
            this.parentNode.classList.add('editing');
            this.nextSibling.focus();
            source.process.drawCanvas(e);
          }
        }
      }
    }));
    title.appendChild(new Element('input', {
      'class': 'workspace-item-title-input',
      value: source.name,
      events: {
        keyup: function (e) {
          if (e.keyCode === 13) {
            saveTitle.call(this, e);
          }
        },
        
        blur: function (e) {
          saveTitle.call(this, e);
        }
      }
    }));
    
    icon = new Element('img', {
      'class': 'workspace-item-icon'
    });
    title.insertBefore(icon, title.childNodes[0]);
    
    content = source.contentElement = new Element('div', {
      'class': 'workspace-item-contents'
    });
    el.appendChild(content);
    
    source.getContentChildren().forEach(function (child) {
      content.appendChild(child);
    });
    
    source.dragging = false;
    source.dragged = false;
    
    return el;
  };
  
}(window));