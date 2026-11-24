/**
 * Hero dust — a field of brass motes around the medallion.
 *
 * One opening bloom (every mote is flung out from the medallion, then eases
 * into a slow drift) and then an almost still haze, like dust in a spotlight.
 * Canvas 2D, no dependencies, driven by the shared rAF budget; the loop only
 * runs while the stage is on screen and the tab is visible. Reduced motion
 * paints a single static frame.
 */
import { isReducedMotion, onFrame } from './raf'

type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  phase: number
  brass: boolean
  flare: boolean
}

const BRASS = '255, 90, 78'
const CREAM = '244, 241, 234'

export const init = (): void => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ra-dust]')
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
  let motes: Mote[] = []
  let elapsed = 0
  let stop: (() => void) | null = null
  let surge = 0
  let lastY = window.scrollY

  // Page-scroll speed leaks into the field: fling the page and the dust
  // streamers streak, then settle back to the spotlight haze.
  if (! reduced) {
    window.addEventListener('scroll', () => {
      surge = Math.min(1.4, surge + Math.abs(window.scrollY - lastY) / 900)
      lastY = window.scrollY
    }, { passive: true })
  }

  const centre = (): [number, number] => [
    width >= 768 ? width * 0.72 : width * 0.5,
    height * (width >= 768 ? 0.44 : 0.32),
  ]

  const seed = (): void => {
    const count = Math.round(Math.min(150, Math.max(38, (width * height) / 15000)))
    const [cx, cy] = centre()
    const reach = Math.max(width, height) * 0.72

    motes = Array.from({ length: count }, (_, index) => {
      // Bias toward the medallion, then let the bloom throw them outward.
      const angle = Math.random() * Math.PI * 2
      const radius = Math.pow(Math.random(), 0.65) * reach * 0.55
      const speed = 45 + Math.random() * 145
      const brass = Math.random() > 0.32

      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius * 0.78,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.8,
        r: 0.55 + Math.random() * 1.15,
        alpha: 0.18 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        brass,
        flare: index % 17 === 0,
      }
    })
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

    seed()
    paint(0, 0)
  }

  const paint = (dt: number, now: number): void => {
    ctx.clearRect(0, 0, width, height)

    const settle = Math.pow(0.16, dt) // bloom decays fast, then drifts
    const drift = 7 * (1 + surge * 5) // px per second once settled

    surge = surge > 0.002 ? surge * Math.max(0, 1 - dt * 2.4) : 0 // fling decays back to haze

    for (const mote of motes) {
      // Ease the opening impulse back toward the slow drift.
      mote.vx += (Math.cos(mote.phase) * drift - mote.vx) * Math.min(1, dt * 2.2)
      mote.vy += (Math.sin(mote.phase * 0.7) * drift * 0.6 - mote.vy) * Math.min(1, dt * 2.2)

      if (dt > 0) {
        mote.x += mote.vx * dt
        mote.y += mote.vy * dt
      }

      if (dt > 0 && settle > 0) {
        // Nothing left to settle: the easing above already does the work.
        void settle
      }

      // Wrap back to the far edge so the field never empties out.
      if (mote.x < -20) {
        mote.x = width + 20
      } else if (mote.x > width + 20) {
        mote.x = -20
      }

      if (mote.y < -20) {
        mote.y = height + 20
      } else if (mote.y > height + 20) {
        mote.y = -20
      }

      const twinkle = 0.72 + Math.sin(now * 1.1 + mote.phase) * 0.28
      const alpha = Math.min(1, mote.alpha * twinkle * (1 + surge * 0.3))
      const colour = mote.brass ? BRASS : CREAM

      if (mote.flare) {
        const glow = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.r * 9)
        glow.addColorStop(0, `rgba(${colour}, ${(alpha * 0.55).toFixed(3)})`)
        glow.addColorStop(1, `rgba(${colour}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(mote.x, mote.y, mote.r * 9, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = `rgba(${colour}, ${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const start = (): void => {
    if (reduced || stop) {
      return
    }

    stop = onFrame((now, delta) => {
      const dt = Math.min(delta, 0.05)
      elapsed += dt
      paint(dt, now)
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
