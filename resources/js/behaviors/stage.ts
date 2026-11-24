/**
 * Night stage — pointer parallax on the medallion and a scroll-progress rail.
 *
 * Everything is transform/opacity only, driven from the shared rAF budget, and
 * the whole behavior is a no-op under prefers-reduced-motion.
 */
import { isReducedMotion } from './raf'

const PARALLAX_X = 14 // px, half-range
const PARALLAX_Y = 10
const ROTATE_RANGE = 1.2 // deg

export const init = (): void => {
  const stage = document.querySelector<HTMLElement>('[data-ra-stage]')

  if (! stage || isReducedMotion()) {
    return
  }

  parallax(stage)
  progress(stage)
  scrollExit(stage)
}

/**
 * Exit parallax: as the stage scrolls away the copy lifts and fades while the
 * medallion sinks and grows slightly — the reel's "the object stays, the type
 * leaves" move. Written to custom properties so the pointer parallax keeps
 * its own transforms on the same element.
 */
const scrollExit = (stage: HTMLElement): void => {
  const copy = stage.querySelector<HTMLElement>('.m-stage__copy')
  const object = stage.querySelector<HTMLElement>('[data-ra-stage-object]')

  if (! copy && ! object) {
    return
  }

  const update = (): void => {
    const rect = stage.getBoundingClientRect()
    const raw = -rect.top / Math.max(rect.height, 1)
    const p = Math.min(1, Math.max(0, raw))

    if (copy) {
      copy.style.setProperty('--ra-exit-copy', `${(p * -48).toFixed(1)}px`)
      copy.style.setProperty('--ra-exit-fade', String((1 - p * 1.15).toFixed(3)))
    }

    if (object) {
      object.style.setProperty('--ra-exit-obj', `${(p * 56).toFixed(1)}px`)
      object.style.setProperty('--ra-exit-scale', (1 + p * 0.05).toFixed(3))
    }
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
}

const parallax = (stage: HTMLElement): void => {
  const object = stage.querySelector<HTMLElement>('[data-ra-stage-object]')

  if (! object) {
    return
  }

  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let frame = 0

  const update = (): void => {
    currentX += (targetX - currentX) * 0.08
    currentY += (targetY - currentY) * 0.08

    object.style.setProperty('--ra-px', `${currentX.toFixed(2)}px`)
    object.style.setProperty('--ra-py', `${currentY.toFixed(2)}px`)
    object.style.setProperty('--ra-pr', `${(currentX / PARALLAX_X * ROTATE_RANGE).toFixed(3)}deg`)

    frame = requestAnimationFrame(update)
  }

  const move = (event: PointerEvent): void => {
    const rect = stage.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    targetX = x * PARALLAX_X * 2
    targetY = y * PARALLAX_Y * 2
  }

  stage.addEventListener('pointermove', move, { passive: true })
  stage.addEventListener('pointerleave', () => {
    targetX = 0
    targetY = 0
  })

  frame = requestAnimationFrame(update)

  // Stop the loop when the stage leaves the viewport.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && frame === 0) {
          frame = requestAnimationFrame(update)
        } else if (! entry.isIntersecting && frame !== 0) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      })
    }, { threshold: 0 }).observe(stage)
  }
}

const progress = (stage: HTMLElement): void => {
  const rail = stage.querySelector<HTMLElement>('[data-ra-stage-rail]')

  if (! rail) {
    return
  }

  const update = (): void => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
    rail.style.setProperty('--ra-progress', `${(Math.min(1, Math.max(0, ratio)) * 100).toFixed(2)}%`)
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
}
