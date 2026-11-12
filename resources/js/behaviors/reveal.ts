/**
 * Scroll reveals — one quiet entrance for `[data-ra-reveal]`.
 *
 * The element fades and lifts 14px, once, on a 420ms ease-out. The hidden
 * state lives in CSS gated on `html.has-js`, set before first paint by an
 * inline snippet, so there is no visible-then-hidden flash; without JS (or if
 * this module never runs) the content is simply visible.
 *
 * A single rAF-throttled scroll sweep reveals anything at or above the fold
 * rather than an IntersectionObserver: a jump (anchor link, restored scroll
 * position, Ctrl+End) skips sections without ever intersecting them, and an
 * observer would leave that content invisible for good.
 */
import { isReducedMotion } from './raf'

const REVEALED = 'is-revealed'
const FOLD = 0.95

export const init = (): void => {
  const root = document.documentElement
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-ra-reveal]'))

  if (els.length === 0) {
    return
  }

  // Safety valve: the inline snippet drops `has-js` if the bundle is slow,
  // in which case the content is already visible and must stay that way.
  if (! root.classList.contains('has-js') || isReducedMotion()) {
    els.forEach((el) => el.classList.add(REVEALED))
    return
  }

  root.dataset.raRevealReady = '1'

  els.forEach((el) => {
    const delay = parseFloat(el.dataset.raRevealDelay ?? '0')

    if (delay > 0) {
      el.style.setProperty('--ra-reveal-delay', `${delay}s`)
    }
  })

  const pending = new Set(els)
  let queued = false

  const sweep = (): void => {
    queued = false

    const fold = window.innerHeight * FOLD

    pending.forEach((el) => {
      if (el.getBoundingClientRect().top >= fold) {
        return
      }

      pending.delete(el)
      el.classList.add(REVEALED)
    })

    if (pending.size === 0) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }

  function onScroll(): void {
    if (queued) {
      return
    }

    queued = true
    requestAnimationFrame(sweep)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  // Above-the-fold content reveals on the next frame instead of waiting for
  // a scroll event that may never come.
  requestAnimationFrame(sweep)
}
