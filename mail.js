/*
 * The container for the meatspace iframe
 */
var container,
    documentHeight,
    toggled = false,
    chatHeight = 380;

var meatChatPane = document.createElement('div');
['nH', 'aJl', 'nn'].forEach(function (cl) {
  meatChatPane.classList.add(cl);
});

meatChatPane.style.width = '267px';

meatChatPane.innerHTML =
    '<div class="aJn">' +
      '<div>' +
        '<div class="nH aAl" style="height: 380px;">' +
          '<iframe src="https://chat.meatspac.es/" frameborder="0" scrolling="no" width="262" height="380"></iframe>' +
        '</div>' +
      '</div>' +
      '<div class="aQV aJo"></div>' +
      '<div class="aQV aJm"></div>' +
      '<div class="aQV aQX"></div>' +
    '</div>';

var iframeContainer = meatChatPane.querySelector('.nH.aAl');
var iframe          = meatChatPane.querySelector('iframe');
var top             = meatChatPane.querySelector('.aQV.aJo');

top.addEventListener('mousedown', startDrag);

function startDrag () {
  if (toggled) {
    return;
  }
  top.removeEventListener('mousedown', startDrag);
  document.addEventListener('mouseup', stopDrag, true);
  top.addEventListener('mouseup', stopDrag, true);
  window.addEventListener('mousemove', reHeightifyEvent);

  window.addEventListener('message', reHightifyRemote);
  window.addEventListener('message', stopDragRemote);
}

function stopDrag () {
  top.addEventListener('mousedown', startDrag);
  document.removeEventListener('mouseup', stopDrag);
  top.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('mousemove', reHeightifyEvent);

  window.removeEventListener('message', reHightifyRemote);
  window.removeEventListener('message', stopDragRemote);
}

function reHeightifyEvent (ev) {
  ev.preventDefault();
  chatHeight = documentHeight - ev.pageY;
  reHeightify();
}

function reHightifyRemote (me) {
  if (me.origin === 'https://chat.meatspac.es' && me.data && me.data.y) {
    chatHeight -= me.data.y;
    reHeightify();
  }
}

function stopDragRemote () {
  if (me.origin === 'https://chat.meatspac.es' && me.data === 'mouseup') {
    stopDrag();
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
  meatChatPane.style.height = documentHeight + 'px';
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

