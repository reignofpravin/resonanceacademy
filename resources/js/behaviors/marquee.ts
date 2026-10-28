/**
 * Marquee ticker for `[data-ra-marquee]`.
 *
 * JS duplicates the track once (aria-hidden clone) until content fills
 * roughly two viewport widths; the loop itself is a CSS keyframe translating
 * exactly half the track, which keeps the seam invisible. Speed comes from
 * `data-ra-marquee-duration` (seconds); hover pauses via CSS.
 * No-op under reduced motion.
 */
import { isReducedMotion } from './raf'

const build = (el: HTMLElement): void => {
  const original = el.innerHTML

  let guard = 0

  while (el.scrollWidth < window.innerWidth * 2 && guard < 10) {
    el.innerHTML += original
    guard += 1
  }

  const clone = el.cloneNode(true) as HTMLElement
  clone.setAttribute('aria-hidden', 'true')
  clone.classList.add('c-marquee__track--clone')
  el.parentElement?.appendChild(clone)
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  document.querySelectorAll<HTMLElement>('[data-ra-marquee]').forEach((el) => {
    const duration = parseFloat(el.dataset.raMarqueeDuration ?? '30')

    el.style.setProperty('--ra-marquee-duration', `${duration}s`)
    el.classList.add('is-running')

    requestAnimationFrame(() => build(el))
  })
}
