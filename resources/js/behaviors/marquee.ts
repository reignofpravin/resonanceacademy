/**
 * Marquee ticker for `[data-ra-marquee]`.
 *
 * The element holds one `.c-marquee__track`. JS appends identical tracks
 * (aria-hidden) until the row is at least twice the viewport wide. Every
 * track animates by its own width, so at the end of a cycle the row snaps
 * back exactly one track — visually identical, seam invisible.
 * No-op under reduced motion.
 */
import { isReducedMotion } from './raf'

const build = (el: HTMLElement): void => {
  const first = el.firstElementChild as HTMLElement | null

  if (! first) {
    return
  }

  const width = (): number =>
    [...el.children].reduce((total, child) => total + (child as HTMLElement).offsetWidth, 0)

  let guard = 0

  while ((el.children.length < 2 || width() < window.innerWidth * 2) && guard < 12) {
    const track = first.cloneNode(true) as HTMLElement
    track.setAttribute('aria-hidden', 'true')
    el.appendChild(track)
    guard += 1
  }
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
