/**
 * Scroll reveals.
 *
 * `[data-ra-reveal]` → fade/translate on enter.
 * `[data-ra-split]`  → SplitType headline: words rise into a mask, line by line.
 * `[data-ra-words]`  → progressive statement: each word lightens as it crosses
 *                      the viewport (scroll-scrubbed, tern-style).
 * Final (revealed) state is the element's natural state; reduced motion and
 * JS-off degrade to content fully visible with no hidden state.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'

import { getLenis } from './scroll'
import { isReducedMotion } from './raf'

gsap.registerPlugin(ScrollTrigger)

const setupScrollTriggerSync = (lenis: Lenis | null): void => {
  if (! lenis) {
    ScrollTrigger.refresh()
    return
  }

  lenis.on('scroll', ScrollTrigger.update)
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const lenis = getLenis()
  setupScrollTriggerSync(lenis)

  gsap.utils.toArray<HTMLElement>('[data-ra-reveal]').forEach((el) => {
    const delay = parseFloat(el.dataset.raRevealDelay ?? '0')

    gsap.fromTo(el, {
      autoAlpha: 0,
      y: 32,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-ra-words]').forEach((headline: HTMLElement) => {
    const split = new SplitType(headline, {
      types: 'words',
      tagName: 'span',
    })

    // tern-style progressive statement: every word starts dim and lightens
    // as the headline travels through the viewport — scrubbed, not once.
    gsap.set(split.words ?? [], { opacity: 0.16 })

    gsap.to(split.words ?? [], {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: headline,
        start: 'top 88%',
        end: 'top 38%',
        scrub: 0.6,
      },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-ra-split]').forEach((headline: HTMLElement) => {
    const split = new SplitType(headline, {
      types: 'lines,words',
      tagName: 'span',
    })

    const lines = split.lines ?? []
    const words = split.words ?? []

    gsap.set(lines, { overflow: 'hidden' })
    gsap.set(words, { yPercent: 115 })

    gsap.to(words, {
      yPercent: 0,
      duration: 0.85,
      ease: 'power4.out',
      stagger: 0.02,
      scrollTrigger: {
        trigger: headline,
        start: 'top 85%',
        once: true,
      },
    })
  })
}
