/**
 * Hero ribbons — slow gold figure-8 hairlines orbiting the medallion,
 * like metallic ribbon caught in a spotlight beam.
 *
 * Three Lissajous curves drawn as thin gradient strokes over each other with
 * additive blending; the phase drifts so the figure breathes. Canvas 2D, no
 * dependencies, driven by the shared rAF budget, and only while the stage is
 * on screen and the tab is visible. Reduced motion paints one static frame.
 */
import { isReducedMotion, onFrame } from './raf'

const GOLD = '214, 166, 60'

type Ribbon = {
  a: number
  b: number
  phase: number
  speed: number
  reach: number
  rise: number
  alpha: number
  tilt: number
}

const RIBBONS: Ribbon[] = [
  { a: 3, b: 2, phase: 0, speed: 0.05, reach: 0.42, rise: 0.3, alpha: 0.3, tilt: -0.12 },
  { a: 5, b: 4, phase: 1.7, speed: -0.04, reach: 0.48, rise: 0.34, alpha: 0.2, tilt: 0.1 },
  { a: 2, b: 3, phase: 3.4, speed: 0.03, reach: 0.36, rise: 0.26, alpha: 0.14, tilt: 0 },
]

export const init = (): void => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ra-ribbons]')
  const stage = canvas?.closest<HTMLElement>('[data-ra-stage]')

  if (! canvas || ! stage) {
    return
  }

  const ctx = canvas.getContext('2d')

  if (! ctx) {
    return
  }

  const reduced = isReducedMotion()

  let width = 0
  let height = 0
  let elapsed = 0
  let stop: (() => void) | null = null

  const centre = (): [number, number] => [
    width >= 768 ? width * 0.72 : width * 0.5,
    height * (width >= 768 ? 0.44 : 0.32),
  ]

  const paint = (t: number): void => {
    ctx.clearRect(0, 0, width, height)

    const [cx, cy] = centre()
    const base = Math.min(width, height)

    ctx.globalCompositeOperation = 'lighter'

    for (const ribbon of RIBBONS) {
      ctx.beginPath()

      const steps = 140

      for (let i = 0; i <= steps; i += 1) {
        const u = (i / steps) * Math.PI * 2
        const x = cx + Math.sin(ribbon.a * u + ribbon.phase + t * ribbon.speed) * base * ribbon.reach
        const y = cy + Math.sin(ribbon.b * u + t * ribbon.speed * 1.3) * base * ribbon.rise + (x - cx) * ribbon.tilt

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      const grad = ctx.createLinearGradient(cx - base * 0.5, cy, cx + base * 0.5, cy)
      grad.addColorStop(0, `rgba(${GOLD}, 0)`)
      grad.addColorStop(0.5, `rgba(${GOLD}, ${ribbon.alpha})`)
      grad.addColorStop(1, `rgba(${GOLD}, 0)`)

      ctx.strokeStyle = grad
      ctx.lineWidth = 1
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'source-over'
  }

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    width = stage.clientWidth
    height = stage.clientHeight

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    paint(elapsed)
  }

  const start = (): void => {
    if (reduced || stop) {
      return
    }

    stop = onFrame((now, delta) => {
      elapsed += Math.min(delta, 0.05)
      paint(elapsed)
      void now
    })
  }

  const halt = (): void => {
    stop?.()
    stop = null
  }

  resize()

  if (reduced) {
    return
  }

  window.addEventListener('resize', resize, { passive: true })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : halt()))
    }, { threshold: 0 }).observe(stage)
  } else {
    start()
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      halt()
    } else {
      start()
    }
  })
}
