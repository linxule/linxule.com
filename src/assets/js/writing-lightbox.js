(function () {
    const lightbox = document.getElementById('article-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let triggerElement = null;
    let previousBodyOverflow = '';
    let inertedElements = [];

    function setBackgroundInert(inert) {
        if (inert) {
            // The lightbox is nested inside main; inert siblings along the
            // ancestor chain without making the dialog itself inert.
            let child = lightbox;
            while (child.parentElement && child !== document.body) {
                Array.from(child.parentElement.children).forEach(sibling => {
                    if (sibling !== child && !sibling.inert) {
                        sibling.inert = true;
                        inertedElements.push(sibling);
                    }
                });
                child = child.parentElement;
            }
        } else {
            inertedElements.forEach(element => { element.inert = false; });
            inertedElements = [];
        }
    }

    // Largest generated candidate in the picture, not the multi-megabyte
    // original that data-full-src still names for og:image and markdown.
    function viewSourceFor(img) {
        const picture = img.closest('picture');
        const candidates = picture?.querySelector('source[type="image/webp"]')?.srcset || img.srcset || '';
        let best = null;
        candidates.split(',').forEach(candidate => {
            const [url, descriptor] = candidate.trim().split(/\s+/);
            const width = Number.parseInt(descriptor || '0', 10) || 0;
            if (url && (!best || width > best.width)) best = { url, width };
        });
        return best?.url || img.dataset.fullSrc || img.src;
    }

    function openLightbox(img) {
        if (lightbox.classList.contains('active')) return;
        triggerElement = img;
        lightboxImg.src = viewSourceFor(img);
        lightboxImg.alt = img.alt || '';
        previousBodyOverflow = document.body.style.overflow;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setBackgroundInert(true);
        // Match the shared gallery: visibility transitions before the close
        // control becomes focusable. Do not steal focus after an early close.
        setTimeout(() => {
            if (lightbox.classList.contains('active')) closeBtn.focus();
        }, 320);
    }

    function closeLightbox() {
        if (!lightbox.classList.contains('active')) return;
        lightbox.classList.remove('active');
        setBackgroundInert(false);
        document.body.style.overflow = previousBodyOverflow;
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }
        lightbox.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.article-body img').forEach(img => {
        // A linked image already has an interaction and a keyboard target.
        if (img.closest('a[href], button')) return;
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'View ' + (img.alt || 'image') + ' full size');
        img.setAttribute('aria-haspopup', 'dialog');
        img.setAttribute('aria-controls', lightbox.id);
        img.addEventListener('click', () => openLightbox(img));
        img.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(img);
            }
        });
    });

    // Preserve the article viewer's click-anywhere-to-close interaction.
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', event => {
        if (!lightbox.classList.contains('active')) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeLightbox();
        } else if (event.key === 'Tab') {
            // This viewer has one control, so both Tab directions stay on it.
            event.preventDefault();
            closeBtn.focus();
        }
    });
})();
