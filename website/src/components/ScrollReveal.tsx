import { useEffect } from 'react';

/**
 * ScrollReveal attaches an IntersectionObserver to animate elements when they
 * enter the viewport. It targets all <section> elements inside <main>, and any
 * element marked with [data-reveal]. It assigns an initial hidden state and
 * adds an 'in-view' class once visible to trigger CSS transitions.
 */
function setupSplitAnimation(container: HTMLElement, mode: 'words' | 'letters', alternate: boolean) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const t = node as Text;
    const trimmed = t.nodeValue?.trim();
    if (trimmed) textNodes.push(t);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue || '';
    const parts = mode === 'words' ? text.split(/(\s+)/) : text.split('');
    const frag = document.createDocumentFragment();
    let index = 0;

    parts.forEach((part) => {
      if (mode === 'words' && part.match(/^\s+$/)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement('span');
      span.className = 'reveal-init reveal-split';
      span.textContent = part;
      span.style.setProperty('--reveal-delay', `${index * 40}ms`);
      // Alternate directions if requested
      if (alternate) {
        const dir = index % 2 === 0 ? 'left' : 'right';
        span.setAttribute('data-reveal-dir', dir);
      }
      frag.appendChild(span);
      index += 1;
    });

    textNode.parentElement?.replaceChild(frag, textNode);
  });
}

export default function ScrollReveal() {
  useEffect(() => {
    // Use requestIdleCallback for non-critical DOM operations
    const setupReveal = () => {
      const selector = 'main section, [data-reveal]';
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

      let delayIndex = 0;
      // Batch DOM updates for better performance
      requestAnimationFrame(() => {
        elements.forEach((el) => {
          if (!el.classList.contains('reveal-init')) {
            el.classList.add('reveal-init');
            // Stagger a bit so siblings cascade nicely
            el.style.setProperty('--reveal-delay', `${(delayIndex % 6) * 60}ms`);
            delayIndex += 1;

            // Set initial direction via attribute or default left
            const dir = (el.getAttribute('data-reveal-dir') as 'left' | 'right' | 'up' | 'down') || 'left';
            switch (dir) {
              case 'right':
                el.style.setProperty('--reveal-tx', '40px');
                el.style.setProperty('--reveal-ty', '0');
                break;
              case 'up':
                el.style.setProperty('--reveal-tx', '0');
                el.style.setProperty('--reveal-ty', '-40px');
                break;
              case 'down':
                el.style.setProperty('--reveal-tx', '0');
                el.style.setProperty('--reveal-ty', '40px');
                break;
              default:
                el.style.setProperty('--reveal-tx', '-40px');
                el.style.setProperty('--reveal-ty', '0');
            }

            // Split text for words/letters when requested (only if really needed)
            const splitMode = (el.getAttribute('data-reveal-split') as 'words' | 'letters' | null);
            const alternate = el.hasAttribute('data-reveal-alt');
            if (splitMode) {
              // Defer text splitting to avoid blocking
              setTimeout(() => setupSplitAnimation(el, splitMode, alternate), 0);
            }
          }
        });
      });

      const observer = new IntersectionObserver(
        (entries) => {
          // Use requestAnimationFrame for smooth animations
          requestAnimationFrame(() => {
            entries.forEach((entry) => {
              const target = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                target.classList.add('in-view');
                // Once revealed, we can unobserve to avoid re-animating on small scrolls
                observer.unobserve(target);
              }
            });
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -5% 0px' } // Reduced threshold for faster triggers
      );

      elements.forEach((el) => observer.observe(el));

      return observer;
    };

    const observer = setupReveal();

    return () => observer.disconnect();
  }, []);

  return null;
}


