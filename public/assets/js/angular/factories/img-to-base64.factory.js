'use strict';

craiglist.factory('imgToBase64', function (url) {
  console.log('Image Factory Loaded');
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    var canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'), dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL();
    resultDiv.innerHTML = dataURL;
    canvas = null;
    return dataURL;
  };
  img.src = url;
})