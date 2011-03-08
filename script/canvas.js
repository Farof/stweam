(function (exports) {
  
  var
  workspace = document.getElementById('workspace'),
  
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
    updatePath();
  },
  stopDrag = function (e) {
    workspace.removeEventListener('mousemove', drag, false);
    workspace.removeEventListener('mouseup', stopDrag, true);
  },
  
  item1 = document.getElementById('item1'), item2 = document.getElementById('item2'),
  canvas = document.getElementById('workCanvas'), ctx = canvas.getContext('2d'),
  clearCanvas = function () {
    canvas.width = canvas.width;
  },
  updatePath = function () {
    var
    onTop = (item1.offsetTop < item2.offsetTop) ? item1 : item2,
    onLeft = (item1.offsetLeft < item2.offsetLeft) ? item1 : item2,
    diffX = Math.abs(item1.offsetLeft - item2.offsetLeft),
    diffY = Math.abs(item1.offsetTop - item2.offsetTop);
    
    clearCanvas();
    
    ctx.moveTo(item1.offsetLeft + ((diffY > diffX) ? (item1.scrollWidth / 2) : ((item1 === onLeft) ? item1.scrollWidth : 0)), 
                item1.offsetTop + ((diffY < diffX) ? (item1.scrollHeight / 2) : ((item1 === onTop) ? item1.scrollHeight : 0)));
    ctx.lineTo(item2.offsetLeft + ((diffY > diffX) ? (item2.scrollWidth / 2) : ((item2 === onLeft) ? item2.scrollWidth : 0)),
                item2.offsetTop + ((diffY < diffX) ? (item2.scrollHeight / 2) : ((item2 === onTop) ? item2.scrollHeight : 0)));
                
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#3E3D40';
    ctx.lineCap = 'round';
    ctx.stroke();
  };
  
  Array.prototype.forEach.call(document.querySelectorAll('.work-item'), function (el) {
    el.addEventListener('mousedown', startDrag, false);
  });
  
  updatePath();
  
}(window));