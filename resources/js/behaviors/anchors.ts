/**
 * In-page anchor routing.
 *
 * Scrolling itself is native (`scroll-behavior: smooth` in CSS). The only job
 * here is timing: the sticky header shrinks by ~56px once the page scrolls, and
 * a native anchor jump measures its destination before that happens, leaving
 * the target tucked under the header. So the click is intercepted, the header
 * is put in its scrolled state first, and the jump runs on the next frame —
 * where `scroll-padding-top` (7.5rem) lands the target exactly below it.
 *
 * Focus moves to the destination because the native hash navigation is
 * suppressed; sections can't take focus natively, so they borrow a tabindex.
 *
 * A deep link (#contact on first load) is replayed once layout settles, and
 * every jump is re-checked when scrolling stops: the browser can still run its
 * own cached fragment scroll afterwards and pull the target back under the
 * header.
 */
const SCROLLED = 'is-scrolled'

const isPlainClick = (event: MouseEvent, anchor: HTMLAnchorElement): boolean =>
  event.button === 0
  && ! event.metaKey
  && ! event.ctrlKey
  && ! event.shiftKey
  && ! event.altKey
  && anchor.target !== '_blank'

export const init = (): void => {
  const header = document.querySelector<HTMLElement>('.js-ra-header')
  const root = document.documentElement

  /**
   * After a jump settles, check the landing. The browser's own fragment scroll
   * (and scroll anchoring) can re-run once layout finishes and drop the target
   * back under the collapsed header; if that happened, align it again. Capped
   * so a browser that insists can't spin us forever.
   */
  const watchSettle = (target: HTMLElement, hash: string, attempt = 0): void => {
    let lastY = -1
    let stable = 0

    const tick = (): void => {
      const y = window.scrollY

      stable = y === lastY ? stable + 1 : 0
      lastY = y

      if (stable < 4) {
        requestAnimationFrame(tick)
        return
      }

      const top = target.getBoundingClientRect().top
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0

      if ((top < headerBottom - 1 || top > headerBottom + 64) && attempt < 2) {
        align(target, hash, attempt + 1)
      }
    }

    requestAnimationFrame(tick)
  }

  const align = (target: HTMLElement, hash: string, attempt = 0): void => {
    // Collapse the header instantly: its min-height is transitioned, so the
    // browser would otherwise measure the target against the tall header and
    // stop ~56px short.
    root.classList.add('is-anchor-jump')
    header?.classList.add(SCROLLED)

    void root.offsetHeight // flush style + layout at the final header size

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    requestAnimationFrame(() => root.classList.remove('is-anchor-jump'))

    if (! target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1')
    }

    target.focus({ preventScroll: true })

    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }

    watchSettle(target, hash, attempt)
  }

  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')

    if (! anchor || ! isPlainClick(event, anchor)) {
      return
    }

    const hash = anchor.getAttribute('href')

    if (! hash || hash === '#') {
      return
    }

    const target = document.querySelector<HTMLElement>(hash)

    if (! target) {
      return
    }

    event.preventDefault()

    // Let the header finish collapsing and layout settle before measuring.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => align(target, hash))
    })
  }, true)

  // Same-document hash changes (back/forward, `location.hash = …`, anchors our
  // click handler skips) never reload, so nothing above runs for them; align
  // them too. pushState in align() doesn't fire this event, so no loop.
  window.addEventListener('hashchange', () => {
    const next = window.location.hash
    const target = next && next !== '#' ? document.querySelector<HTMLElement>(next) : null

    if (! target) {
      return
    }

    align(target, next)
  })

  // A page opened on #hash has the same problem: the inline head snippet
  // stashes and strips the fragment, and the jump is replayed once fonts and
  // images have settled so the measurement is final.
  const hash = (window as Window & { __raInitialHash?: string }).__raInitialHash ?? ''
  const initial = hash ? document.querySelector<HTMLElement>(hash) : null

  if (initial) {
    const correct = (): void => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => align(initial, hash))
      })
    }

    if (document.readyState === 'complete') {
      correct()
    } else {
      window.addEventListener('load', correct, { once: true })
    }
  }
}
