/**
 * Shared rAF budget-holder.
 *
 * One loop drives every behavior that needs continuous updates; the loop
 * only runs while at least one callback is registered and never runs when
 * the user prefers reduced motion.
 */

type FrameCallback = (elapsed: number, delta: number) => void

const callbacks = new Set<FrameCallback>()
let rafId = 0
let last = 0

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function tick(now: number): void {
  const delta = last ? (now - last) / 1000 : 0
  last = now

  callbacks.forEach((cb) => cb(now / 1000, delta))

  if (callbacks.size > 0) {
    rafId = requestAnimationFrame(tick)
  } else {
    last = 0
    rafId = 0
  }
}

export const onFrame = (cb: FrameCallback): (() => void) => {
  callbacks.add(cb)

  if (rafId === 0 && !prefersReducedMotion()) {
    rafId = requestAnimationFrame(tick)
  }

  return () => callbacks.delete(cb)
}

export const isReducedMotion = prefersReducedMotion
