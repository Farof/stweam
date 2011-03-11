(function (exports) {
  
  exports.WorkspaceElement = function WorkspaceElement(source) {
    var el, title, icon, content, child, saveTitle;
    
    el = new Element('div', {
      'class': 'workspace-item item-type-' + source.itemType + ' type-' + source.type.type,
      source: source
    });
    el.style.left = source.position.left + 'px';
    el.style.top = source.position.top + 'px';
    el.style.position = 'absolute';
    
    title = new Element('p', {
      'class': 'workspace-item-title-zone',
      workspaceItem: el
    });
    saveTitle = title.save = function (event) {
      var value = this.querySelector('.workspace-item-title-input').value;
      this.querySelector('.workspace-item-title').textContent = value;
      source.name = value;
      source.updated('name', value);
      this.classList.remove('editing');
      Process.loadedItem.drawCanvas();
    }.bind(title);
    el.appendChild(title);
    
    title.appendChild(new Element('span', {
      'class': 'workspace-item-title',
      text: source.name,
      workspaceItem: el,
      events: {
        click: function () {
          if (!this.parentNode.parentNode.dragged) {
            this.parentNode.classList.add('editing');
            this.nextSibling.focus();
            Process.loadedItem.drawCanvas();
          } else {
            console.log('source dragged');
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
    
    content = new Element('div', {
      'class': 'workspace-item-content'
    });
    el.appendChild(content);
    
    child = new Element('p', {
      'class': 'item-type',
      title: source.type.description || ''
    });
    child.appendChild(new Element('span', {
      'class': 'item-type-label',
      text: 'Type: '
    }));
    child.appendChild(new Element('span', {
      'class': 'item-type-name',
      text: source.type.label
    }));
    
    content.appendChild(child);
    
    source.dragging = false;
    source.dragged = false;
    
    return el;
  };
  
}(window));