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
    onTop = (source.offsetTop < dest.offsetTop) ? source : dest,
    onLeft = (source.offsetLeft < dest.offsetLeft) ? source : dest,
    diffX = Math.abs(source.offsetLeft - dest.offsetLeft),
    diffY = Math.abs(source.offsetTop - dest.offsetTop);
    
    clearCanvas();
    
    ctx.moveTo(source.offsetLeft + ((diffY > diffX) ? (source.scrollWidth / 2) : ((source === onLeft) ? source.scrollWidth : 0)), 
                source.offsetTop + ((diffY < diffX) ? (source.scrollHeight / 2) : ((source === onTop) ? source.scrollHeight : 0)));
    ctx.lineTo(dest.offsetLeft + ((diffY > diffX) ? (dest.scrollWidth / 2) : ((dest === onLeft) ? dest.scrollWidth : 0)),
                dest.offsetTop + ((diffY < diffX) ? (dest.scrollHeight / 2) : ((dest === onTop) ? dest.scrollHeight : 0)));
                
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