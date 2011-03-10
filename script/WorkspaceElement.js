(function (exports) {
  
  exports.WorkspaceElement = function WorkspaceElement(source) {
    var el, title, icon, content, child;
    
    el = new Element('div', {
      'class': 'workspace-item item-type-' + source.itemType + ' type-' + source.type.type,
      source: source
    });
    el.style.left = source.position.left + 'px';
    el.style.top = source.position.top + 'px';
    el.style.position = 'absolute';
    
    title = new Element('p', {
      'class': 'workspace-item-title',
      text: source.name,
      workspaceItem: el
    });
    el.appendChild(title);
    
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
    
    return el;
  };
  
}(window));