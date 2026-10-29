/**
 * Lenis smooth scrolling + in-page anchor routing.
 *
 * Skipped entirely when the user prefers reduced motion; anchors fall back
 * to native jump behaviour in that case.
 */
import Lenis from 'lenis'

import { isReducedMotion } from './raf'

let lenis: Lenis | null = null

export const getLenis = (): Lenis | null => lenis

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Lenis >= 1.2 defaults autoRaf to false and nothing here drives
    // lenis.raf() — without this the smoother (and every anchor target
    // routed through it) never actually scrolls.
    autoRaf: true,
  })

  // Anchor routing through Lenis so target scrolls are eased
  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')

    if (! anchor || ! lenis) {
      return
    }

    const hash = anchor.getAttribute('href')

    if (! hash || hash === '#') {
      return
    }

    const target = document.querySelector(hash)

    if (! target) {
      return
    }

    event.preventDefault()
    lenis.scrollTo(target as HTMLElement, { offset: -80 })

    // Keyboard: hand focus to the destination (native hash navigation was
    // suppressed above, so focus must be moved explicitly). Sections can't
    // receive focus natively; lend them tabindex when they lack one.
    const targetEl = target as HTMLElement

    if (! targetEl.hasAttribute('tabindex')) {
      targetEl.setAttribute('tabindex', '-1')
    }

    targetEl.focus({ preventScroll: true })
  }, true)
}
