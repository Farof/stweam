(function (exports) {
  
  var
  workspace = document.getElementById('workspace'),
  item1 = document.getElementById('item1'), item2 = document.getElementById('item2'),
  
  movingItem, oriX, oriY, offsetX, offsetY,
  startDrag = function (e) {
    movingItem = e.target;
    oriX = e.clientX;
    oriY = e.clientY;
    offsetX = movingItem.offsetLeft;
    offsetY = movingItem.offsetTop;
    workspace.addEventListener('mousemove', drag, false);
    workspace.addEventListener('mouseup', stopDrag, true);
  },
  drag = function (e) {
    movingItem.style.top = (offsetY + (e.clientY - oriY)) + 'px';
    movingItem.style.left = (offsetX + (e.clientX - oriX)) + 'px';
    updateLineBetween(item1, item2);
  },
  stopDrag = function (e) {
    workspace.removeEventListener('mousemove', drag, false);
    workspace.removeEventListener('mouseup', stopDrag, true);
  },
  
  canvas = document.getElementById('workCanvas'), ctx = canvas.getContext('2d'),
  clearCanvas = function () {
    canvas.width = canvas.width;
  },
  updateLineBetween = function (source, dest) {
    var
    sourceOnTop = source.offsetTop < dest.offsetTop,
    sourceOnLeft = source.offsetLeft < dest.offsetLeft,
    diffX = Math.abs(source.offsetLeft - dest.offsetLeft),
    diffY = Math.abs(source.offsetTop - dest.offsetTop),
    diffIsHeight = diffY > diffX,
    
    
    startX = source.offsetLeft + (diffIsHeight ? (source.scrollWidth / 2) : (sourceOnLeft ? source.scrollWidth : 0)),
    startY = source.offsetTop + (!diffIsHeight ? (source.scrollHeight / 2) : (sourceOnTop ? source.scrollHeight : 0)),
    startControlX = startX + (diffIsHeight ? 0 : (sourceOnLeft ? 50 : -50)),
    startControlY = startY + (!diffIsHeight ? 0 : (sourceOnTop ? 50 : -50))
    endX = dest.offsetLeft + (diffIsHeight ? (dest.scrollWidth / 2) : (!sourceOnLeft ? dest.scrollWidth : 0)),
    endY = dest.offsetTop + (!diffIsHeight ? (dest.scrollHeight / 2) : (!sourceOnTop ? dest.scrollHeight : 0)),
    endControlX = endX + (diffIsHeight ? 0 : (!sourceOnLeft ? 50 : -50)),
    endControlY = endY + (!diffIsHeight ? 0 : (!sourceOnTop ? 50 : -50));
    
    clearCanvas();
    
    ctx.moveTo(startX, startY);
    //ctx.lineTo(endX, endY);
    ctx.bezierCurveTo(startControlX, startControlY, endControlX, endControlY, endX, endY);
                
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#3E3D40';
    ctx.lineCap = 'round';
    ctx.stroke();
  };
  
  Array.prototype.forEach.call(document.querySelectorAll('.work-item'), function (el) {
    el.addEventListener('mousedown', startDrag, false);
  });
  
  updateLineBetween(item1, item2);
  
}(window));