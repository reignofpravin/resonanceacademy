/**
 * Scramble — the technical voice decodes on arrival.
 *
 * Kicker lines ([data-ra-scramble], .c-kicker) run their text through a
 * glyph scramble once when they scroll into view, like a title card
 * resolving. The headings keep their word-mask reveal; only the mono
 * labels decode, so the two never compete for the same element.
 *
 * Reduced motion (or no JS) leaves the text exactly as authored.
 */
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

import { isReducedMotion } from './raf'

gsap.registerPlugin(ScrambleTextPlugin)

const SELECTOR = '[data-ra-scramble], .c-kicker'

export const init = (): void => {
  if (isReducedMotion() || ! ('IntersectionObserver' in window)) {
    return
  }

  const seen = new WeakSet<Element>()

  const decode = (el: HTMLElement): void => {
    const original = el.textContent ?? ''

    if (original.trim() === '') {
      return
    }

    gsap.to(el, {
      duration: 0.7,
      overwrite: 'auto',
      scrambleText: { text: original, chars: 'upperCase', speed: 0.5 },
      onComplete: () => {
        el.textContent = original
      },
    })
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (! entry.isIntersecting || seen.has(entry.target)) {
        return
      }

      seen.add(entry.target)
      decode(entry.target as HTMLElement)
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.6 })

  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => observer.observe(el))
}
