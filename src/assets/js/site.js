// Shared page behavior. Keep the early font cloak inline in base.njk.
(function () {
    const bloom = document.getElementById('bloom');
    if (bloom) {
        let pendingFrame = false;
        let clientX = 0;
        let clientY = 0;
        document.addEventListener('mousemove', event => {
            clientX = event.clientX;
            clientY = event.clientY;
            if (pendingFrame) return;
            pendingFrame = true;
            requestAnimationFrame(() => {
                bloom.style.left = clientX + 'px';
                bloom.style.top = clientY + 'px';
                pendingFrame = false;
            });
        });
    }

    // Compare parsed origins: a hostname can also occur in another site's
    // query string or path. Preserve semantic rel values such as "license".
    document.querySelectorAll('a[href]').forEach(link => {
        let url;
        try {
            url = new URL(link.href);
        } catch {
            return;
        }
        if ((url.protocol === 'http:' || url.protocol === 'https:') &&
            url.origin !== window.location.origin) {
            link.target = '_blank';
            link.relList.add('noopener', 'noreferrer');
        }
    });

    // Making book mode owns its internal scroller and restoration policy.
    if ('scrollRestoration' in history && !document.getElementById('making-book')) {
        history.scrollRestoration = 'auto';
    }

    function restoreScrollBehavior() {
        setTimeout(() => {
            // Let the stylesheet, including reduced-motion preferences, decide.
            document.documentElement.style.scrollBehavior = '';
        }, 100);
    }

    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            document.documentElement.style.scrollBehavior = 'auto';
            restoreScrollBehavior();
        }
    });

    const currentPath = window.location.pathname;
    const storageKey = 'scrollPos_' + currentPath;

    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') ||
            (link.target && link.target !== '_self')) return;

        try {
            const destination = new URL(link.href);
            if (destination.origin !== window.location.origin ||
                destination.pathname === currentPath) return;
            sessionStorage.setItem(storageKey, String(window.scrollY));
        } catch {
            // Storage may be unavailable. Navigation still uses the native path.
        }
    });

    try {
        const savedPos = sessionStorage.getItem(storageKey);
        if (savedPos === null || !document.referrer) return;
        const referrer = new URL(document.referrer);
        const position = Number(savedPos);
        if (referrer.origin === window.location.origin &&
            referrer.pathname.startsWith(currentPath) &&
            referrer.pathname !== currentPath &&
            Number.isFinite(position) && position >= 0) {
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, position);
            restoreScrollBehavior();
            sessionStorage.removeItem(storageKey);
        }
    } catch {
        // Blocked storage or an invalid referrer must not interrupt the page.
    }
})();
