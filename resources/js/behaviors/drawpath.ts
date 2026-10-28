/**
 * SVG path drawing for `[data-ra-path]`.
 *
 * Sets stroke-dasharray/offset to path length, then animates the offset to
 * zero via CSS transition when the element enters the viewport.
 * No-op under reduced motion (path renders fully drawn).
 */
import { isReducedMotion } from './raf'

const prepare = (el: SVGPathElement): void => {
  const length = el.getTotalLength()

  el.style.strokeDasharray = `${length}`
  el.style.strokeDashoffset = `${length}`
  el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)'

  requestAnimationFrame(() => {
    el.style.strokeDashoffset = '0'
  })
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        prepare(entry.target as SVGPathElement)
      }
    })
  }, { threshold: 0.3 })

  document.querySelectorAll<SVGPathElement>('[data-ra-path]').forEach((el) => {
    if (! (el instanceof SVGPathElement)) {
      return
    }

    observer.observe(el)
  })
}
