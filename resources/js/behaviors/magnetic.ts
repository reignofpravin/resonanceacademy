/**
 * Magnetic CTAs — the gold pills lean toward the hand that reaches for them.
 *
 * A pointer inside the button pulls it a few pixels along the cursor vector
 * on a spring; leaving springs it home. Purely decorative: keyboard and
 * touch never see it, and it is absent under reduced motion.
 */
import gsap from 'gsap'

import { isReducedMotion } from './raf'

const PULL = 7 // px at the button's edge
const SELECTOR = '.m-header__plate--cta, .m-stage .btn, .m-contact__form [type="submit"]'

export const init = (): void => {
  if (isReducedMotion() || ! window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return
  }

  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    const toX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const toY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5

      toX(nx * PULL * 2)
      toY(ny * PULL * 2)
    })

    el.addEventListener('pointerleave', () => {
      toX(0)
      toY(0)
    })
  })
}
