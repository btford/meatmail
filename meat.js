/*
 * Runs in the context of the meatspace iframe
 */

window.addEventListener('mousemove', function (ev) {
  window.parent.postMessage({
    y: ev.y,
    x: ev.x
  }, '*');
});

window.addEventListener('mouseup', function (ev) {
  window.parent.postMessage('mouseup', '*');
});

var header = document.querySelector('.header');

header.innerHTML = '<span class="eN"></span> Meatspace';
header.addEventListener('click', function () {
  window.parent.postMessage('toggle', '*');
});

var footer = document.querySelector('#footer');
var chatBox = document.querySelector('#add-chat');

chatBox.addEventListener('focus', function () {
  footer.classList.add('focus');
});

chatBox.addEventListener('blur', function () {
  footer.classList.remove('focus');
});
