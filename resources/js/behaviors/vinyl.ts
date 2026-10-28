/**
 * Record spin for `.js-ra-vinyl` — record decorations that rotate while
 * scrolling is active (velocity-driven), settling back when idle.
 * No-op under reduced motion.
 */
import { isReducedMotion, onFrame } from './raf'

import { getLenis } from './scroll'

const MAX_ROTATION = 220

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const discs = Array.from(document.querySelectorAll<HTMLElement>('.js-ra-vinyl'))

  if (discs.length === 0) {
    return
  }

  let rotation = 0
  let velocity = 0

  onFrame((_, delta) => {
    const lenis = getLenis()
    const lenisVelocity = (lenis as unknown as { velocity?: number } | null)?.velocity ?? 0

    velocity = Math.abs(lenisVelocity)
    const pull = velocity / 60

    rotation = Math.min(MAX_ROTATION, rotation + (pull > 0.01 ? pull : delta * 20))
    discs.forEach((disc) => {
      disc.style.transform = `rotate(${rotation.toFixed(2)}deg)`
    })
  })
}
