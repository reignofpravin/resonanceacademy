/**
 * Depth — one quiet parallax for marked layers.
 *
 * Elements carrying `[data-ra-depth]` lean toward the cursor (the number is
 * the layer's depth: 1 ≈ a gentle 16px drift) and elements carrying
 * `[data-ra-parallax]` sink against the scroll at that rate. Both arrive as
 * `--ra-dx` / `--ra-dy` custom properties so each layer composes its own
 * transform and never fights another behavior's.
 *
 * The shared rAF budget owns the loop: no pointer, no scroll, no work;
 * reduced motion never enters here at all.
 */
import { isReducedMotion, onFrame } from './raf'

const POINTER_X = 16 // px of drift at depth 1, half-range
const POINTER_Y = 10

type Layer = {
  el: HTMLElement
  depth: number
  rate: number
  x: number
  y: number
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const layers: Layer[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-ra-depth],[data-ra-parallax]'),
  ).map((el) => ({
    el,
    depth: Number.parseFloat(el.dataset.raDepth ?? '0'),
    rate: Number.parseFloat(el.dataset.raParallax ?? '0'),
    x: 0,
    y: 0,
  }))

  if (layers.length === 0) {
    return
  }

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  let px = 0
  let py = 0
  let lastInput = performance.now()

  const noteInput = (): void => {
    lastInput = performance.now()
  }

  if (fine) {
    window.addEventListener(
      'pointermove',
      (event) => {
        px = event.clientX / window.innerWidth - 0.5
        py = event.clientY / window.innerHeight - 0.5
        noteInput()
      },
      { passive: true },
    )

    window.addEventListener('pointerleave', () => {
      px = 0
      py = 0
      noteInput()
    })
  }

  window.addEventListener('scroll', noteInput, { passive: true })

  onFrame((now, delta) => {
    // Idle for a beat and the loop does nothing at all — the layers have
    // already settled where the pointer and the scroll left them.
    if (now * 1000 - lastInput > 1400) {
      return
    }

    const dt = Math.min(delta, 0.05)
    const ease = Math.min(1, dt * 4.5)

    for (const layer of layers) {
      const rect = layer.el.getBoundingClientRect()

      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) {
        continue
      }

      // The pointer drift eases toward its target; the scroll sink does not.
      // A lerped scroll term trails the page by a dozen frames and reads as
      // lag on every parallax layer at once — the opposite of depth.
      const tx = px * layer.depth * POINTER_X * 2
      const ty = py * layer.depth * POINTER_Y * 2

      layer.x += (tx - layer.x) * ease
      layer.y += (ty - layer.y) * ease

      let dy = layer.y

      if (layer.rate > 0) {
        // Centre of the layer measured from the centre of the viewport,
        // so the drift sign flips as the element passes through.
        dy += -((rect.top + rect.height / 2 - window.innerHeight / 2) * layer.rate)
      }

      layer.el.style.setProperty('--ra-dx', `${layer.x.toFixed(2)}px`)
      layer.el.style.setProperty('--ra-dy', `${dy.toFixed(2)}px`)
    }
  })
}
