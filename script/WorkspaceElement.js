(function (exports) {
  
  exports.WorkspaceElement = function WorkspaceElement(source) {
    var el, title, content;
    
    el = new Element('div', {
      'class': 'workspace-item',
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
    
    content = new Element('div', {
      'class': 'workspace-item-content'
    });
    el.appendChild(content);
    
    return el;
  };
  
}(window));