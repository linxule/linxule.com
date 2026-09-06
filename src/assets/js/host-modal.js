// Host chrome owns focus; embedded works retain their own controls and sandbox.
export function createHostModal(root, { closeControl, requestClose, label }) {
  let active = false;
  let trigger = null;
  let previousOverflow = '';
  let outside = [];
  let previousRole;
  let previousModal;
  let previousLabel;
  const guestWindows = new Set();
  const frames = [...root.querySelectorAll('iframe')];

  function focusClose() {
    if (active) closeControl.focus({ preventScroll: true });
  }

  // The visible exit hint is for the reader who is navigating by keyboard;
  // everyone else sees only the work. (Assistive tech reads it regardless.)
  function markKeyboard() {
    if (active) root.setAttribute('data-keyboard', '');
  }

  // The parent's keydown handler cannot see keys inside an opaque/cross-origin
  // iframe. Native Tab navigation *does* leave the frame: catch that next stop
  // on either side, before it can enter the background page or browser chrome.
  const guards = [document.createElement('span'), document.createElement('span')];
  for (const guard of guards) {
    guard.tabIndex = 0;
    guard.hidden = true;
    guard.setAttribute('aria-label', 'Return to close');
    guard.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;';
    guard.addEventListener('focus', () => { markKeyboard(); focusClose(); });
  }
  root.prepend(guards[0]);
  root.append(guards[1]);

  function onKeydown(event) {
    if (event.key === 'Tab') markKeyboard();
    if (active && event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      requestClose();
    }
  }

  function onFocus(event) {
    if (active && !root.contains(event.target)) focusClose();
  }

  function bindLocalDeck(frame) {
    // Only owned, unsandboxed decks can participate without changing their
    // capabilities. Never grant same-origin/script permissions for this bridge.
    if (!active || frame.hasAttribute('sandbox')) return;
    try {
      const url = new URL(frame.src, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith('/assets/slides/')) return;
      const guest = frame.contentWindow;
      if (!guest.document || guest.location.origin !== location.origin) return;
      // Bubble after the guest's own handlers, respecting handled Escape keys.
      guest.addEventListener('keydown', onKeydown);
      guestWindows.add(guest);
    } catch (_) { /* A redirected or foreign guest keeps the Tab exit path. */ }
  }

  frames.forEach(frame => frame.addEventListener('load', () => bindLocalDeck(frame)));

  function restoreAttribute(name, value) {
    if (value === null) root.removeAttribute(name);
    else root.setAttribute(name, value);
  }

  return {
    open(nextTrigger = document.activeElement) {
      if (active) return;
      active = true;
      trigger = nextTrigger;
      previousOverflow = document.body.style.overflow;
      previousRole = root.getAttribute('role');
      previousModal = root.getAttribute('aria-modal');
      previousLabel = root.getAttribute('aria-label');
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      if (label) root.setAttribute('aria-label', label);
      document.body.style.overflow = 'hidden';
      let current = root;
      while (current.parentElement) {
        for (const sibling of current.parentElement.children) {
          if (sibling !== current && !sibling.inert) {
            sibling.inert = true;
            outside.push(sibling);
          }
        }
        current = current.parentElement;
        if (current === document.body) break;
      }
      guards.forEach(guard => { guard.hidden = false; });
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('focusin', onFocus);
      frames.forEach(bindLocalDeck);
      // Flush the newly visible layout before moving focus. A deferred focus
      // callback could steal it back from a reader who has already entered the
      // guest; an unflushed visibility transition can leave it on the trigger.
      root.getBoundingClientRect();
      focusClose();
    },
    close() {
      if (!active) return;
      active = false;
      root.removeAttribute('data-keyboard');
      guards.forEach(guard => { guard.hidden = true; });
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('focusin', onFocus);
      for (const guest of guestWindows) {
        try { guest.removeEventListener('keydown', onKeydown); } catch (_) { /* navigated away */ }
      }
      guestWindows.clear();
      outside.forEach(sibling => { sibling.inert = false; });
      outside = [];
      document.body.style.overflow = previousOverflow;
      restoreAttribute('role', previousRole);
      restoreAttribute('aria-modal', previousModal);
      restoreAttribute('aria-label', previousLabel);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      trigger = null;
    },
  };
}
