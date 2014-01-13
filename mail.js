/*
 * The container for the meatspace iframe
 */
var container,
    documentHeight,
    documentWidth,
    toggled = false,
    chatHeight = 380,
    chatWidth = 262,
    meatChatPane;

meatChatPane = document.createElement('div');
['nH', 'aJl', 'nn'].forEach(function (cl) {
  meatChatPane.classList.add(cl);
});

meatChatPane.style.width = (chatWidth + 5) + 'px';

meatChatPane.innerHTML =
    '<div class="aJn">' +
      '<div>' +
        '<div class="nH aAl" style="height: ' + chatHeight + 'px;">' +
          '<iframe src="https://chat.meatspac.es/" frameborder="0" scrolling="no" width="' + chatWidth + '" height="' + chatHeight + '"></iframe>' +
        '</div>' +
      '</div>' +
      '<div class="aQV aJo"></div>' +
      '<div class="aQV aJm"></div>' +
      '<div class="aQV aQX"></div>' +
    '</div>';

var iframeContainer = meatChatPane.querySelector('.nH.aAl');
var iframe          = meatChatPane.querySelector('iframe');
var top             = meatChatPane.querySelector('.aQV.aJo');
var left            = meatChatPane.querySelector('.aQV.aJm');

top.addEventListener('mousedown', startVerticalDrag, true);
left.addEventListener('mousedown', startHorizontalDrag, true);

function startVerticalDrag () {
  if (toggled) {
    return;
  }
  top.removeEventListener('mousedown', startVerticalDrag, true);
  document.addEventListener('mouseup', stopVerticalDrag, true);

  window.addEventListener('mousemove', reHeightifyEvent, true);

  window.addEventListener('message', reHightifyRemote);
  window.addEventListener('message', stopVerticalDragRemote);
}

function stopVerticalDrag () {
  top.addEventListener('mousedown', startVerticalDrag, true);
  document.removeEventListener('mouseup', stopVerticalDrag, true);

  window.removeEventListener('mousemove', reHeightifyEvent, true);

  window.removeEventListener('message', reHightifyRemote);
  window.removeEventListener('message', stopVerticalDragRemote);
}

function startHorizontalDrag () {
  if (toggled) {
    return;
  }
  left.removeEventListener('mousedown', startHorizontalDrag, true);
  document.addEventListener('mouseup', stopHorizontalDrag, true);

  window.addEventListener('mousemove', reWidthifyEvent, true);

  window.addEventListener('message', reWidthifyRemote);
  window.addEventListener('message', stopHorizontalDragRemote);
}

function stopHorizontalDrag () {
  left.addEventListener('mousedown', startHorizontalDrag, true);
  document.removeEventListener('mouseup', stopHorizontalDrag, true);

  window.removeEventListener('mousemove', reWidthifyEvent, true);

  window.removeEventListener('message', reWidthifyRemote);
  window.removeEventListener('message', stopHorizontalDragRemote);
}

function reHeightifyEvent (ev) {
  ev.preventDefault();
  ev.stopPropagation();
  chatHeight = documentHeight - ev.pageY;
  reHeightify();
}

function reWidthifyEvent (ev) {
  ev.preventDefault();
  ev.stopPropagation();
  chatWidth = documentWidth - ev.pageX;
  reWidthify();
}

function reHightifyRemote (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data && me.data.y) {
    chatHeight -= me.data.y;
    reHeightify();
  }
}

function reWidthifyRemote (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data && me.data.x) {
    chatWidth -= me.data.x;
    reWidthify();
  }
}

function stopVerticalDragRemote (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data === 'mouseup') {
    stopVerticalDrag();
  }
}

function stopHorizontalDragRemote (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data === 'mouseup') {
    stopVerticalDrag();
  }
}

function reHeightify () {
  if (chatHeight > documentHeight - 107) {
    chatHeight = documentHeight - 107;
  } else if (chatHeight < 175) {
    chatHeight = 175;
  }
  var h = chatHeight + 'px';
  iframeContainer.style.height = h;
  iframe.style.height = h;
}


function reWidthify () {
  if (chatWidth < 100) {
    chatWidth = 100;
  }
  meatChatPane.style.width = (chatWidth + 5) + 'px';
  iframe.style.width = chatWidth + 'px';
}


function findContainer () {
  container = document.querySelector('.no[style]');

  if (!container || !container.childNodes[0]) {
    setTimeout(findContainer, 50);
  } else {
    window.addEventListener('resize', resizeMeatchat);
    resizeMeatchat();
    container.insertBefore(meatChatPane, container.childNodes[0]);
  }
}

function resizeMeatchat () {
  documentHeight = document.body.clientHeight;
  documentWidth = document.body.clientWidth;
  meatChatPane.style.height = documentHeight + 'px';
}

function getLeft (elt) {
  var x = 0;
  do {
    x += elt.offsetLeft;
  } while ((elt = elt.parentElement) !== null);
  return x;
}

window.addEventListener('message', function (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data === 'toggle') {
    toggled = !toggled;
    if (toggled) {
      iframeContainer.style.height = '36px';
    } else {
      reHeightify();
    }
  }
});

/*
 * init
 */

findContainer();

