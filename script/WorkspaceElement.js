(function (exports) {
  
  exports.WorkspaceElement = function WorkspaceElement(source) {
    var el, title, content;
    
    el = new Element('div', {
      class: 'workspace-item',
      source: source
    });
    
    title = new Element('p', {
      class: 'workspace-item-title',
      text: source.name,
      workspaceItem: el
    });
    el.appendChild(title);
    
    content = new Element('div', {
      class: 'workspace-item-content'
    });
    el.appendChild(content);
    
    return el;
  };
  
}(window));