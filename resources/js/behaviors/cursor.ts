/**
 * Cursor glow — a soft brass light that trails the pointer.
 *
 * Only on devices with a real pointer, never under reduced motion. A single
 * fixed element, positioned with `translate3d` from the shared rAF budget, so
 * it costs one compositor layer and no layout.
 */
import { isReducedMotion, onFrame } from './raf'

export const init = (): void => {
  if (isReducedMotion() || ! window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return
  }

  const glow = document.createElement('div')

  glow.className = 'ra-cursor-glow'
  glow.setAttribute('aria-hidden', 'true')
  document.body.appendChild(glow)

  let targetX = 0
  let targetY = 0
  let x = 0
  let y = 0
  let seeded = false
  let stop: (() => void) | null = null

  const move = (event: PointerEvent): void => {
    targetX = event.clientX
    targetY = event.clientY

    if (! seeded) {
      seeded = true
      x = targetX
      y = targetY
      glow.classList.add('is-on')
    }

    if (! stop) {
      stop = onFrame(() => {
        x += (targetX - x) * 0.12
        y += (targetY - y) * 0.12
        glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      })
    }
  }

  window.addEventListener('pointermove', move, { passive: true })

  document.addEventListener('pointerleave', () => {
    glow.classList.remove('is-on')
  })

  document.addEventListener('pointerenter', () => {
    if (seeded) {
      glow.classList.add('is-on')
    }
  })
}
