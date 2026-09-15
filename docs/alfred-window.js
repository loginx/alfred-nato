// Prints the window id of Alfred's visible search window, for screencapture -l.
ObjC.import('CoreGraphics');
const l = $.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly, 0);
let id = '';
for (let i = 0; i < $.CFArrayGetCount(l) && !id; i++) {
  const w = ObjC.deepUnwrap(ObjC.castRefToObject($.CFArrayGetValueAtIndex(l, i)));
  if (w.kCGWindowOwnerName === 'Alfred') id = w.kCGWindowNumber;
}
id;
