/**
 * Hero canvas: breathing waveform or equalizer bars.
 *
 * `<canvas data-ra-hero-wave="wave">` (default "wave").
 * rAF stops when the canvas leaves the viewport and stays off entirely
 * under reduced motion.
 */
import { isReducedMotion, onFrame } from './raf'

type Ctx = CanvasRenderingContext2D

let visibleCanvases: HTMLCanvasElement[] = []

const paint = (ctx: Ctx, w: number, h: number, t: number, mode: string): void => {
  ctx.clearRect(0, 0, w, h)

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--ra-accent') || '#c25e3a'

  ctx.globalAlpha = 0.35
  ctx.strokeStyle = accent
  ctx.fillStyle = accent
  ctx.lineWidth = 1.25

  if (mode === 'bars') {
    const count = 32
    const gap = w / count

    for (let i = 0; i < count; i += 1) {
      const wave = Math.sin(t * 1.6 + i * 0.7) * Math.cos(t * 0.9 + i * 0.33)
      const barh = Math.abs(wave) * h * 0.42 + 6
      const x = i * gap + gap * 0.28

      ctx.globalAlpha = 0.12 + Math.abs(wave) * 0.14
      ctx.beginPath()
      ctx.roundRect(x, h - barh, gap * 0.44, barh, 3)
      ctx.fill()
    }

    return
  }

  // dual-harmonic sine wave
  for (let layer = 0; layer < 2; layer += 1) {
    ctx.globalAlpha = layer === 0 ? 0.28 : 0.14
    ctx.beginPath()

    for (let x = 0; x <= w; x += 6) {
      const p = x / w
      const y = h / 2
        + Math.sin(p * Math.PI * 3 + t * (1.1 + layer * 0.35)) * h * 0.16
        + Math.sin(p * Math.PI * 7 - t * (0.7 + layer * 0.2)) * h * 0.05
        + Math.sin(t * 0.8) * 4

      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const observer = new IntersectionObserver((entries) => {
    visibleCanvases = visibleCanvases.filter((c) => entries.every((entry) => entry.target !== c || entry.isIntersecting))
    entries.forEach((entry) => {
      if (entry.isIntersecting && ! visibleCanvases.includes(entry.target as HTMLCanvasElement)) {
        visibleCanvases.push(entry.target as HTMLCanvasElement)
      }
    })
  })

  document.querySelectorAll<HTMLCanvasElement>('[data-ra-hero-wave]').forEach((canvas) => {
    observer.observe(canvas)
  })

  onFrame((t, delta) => {
    if (visibleCanvases.length === 0) {
      return
    }

    visibleCanvases.forEach((canvas) => {
      const parent = canvas.parentElement

      if (! parent) {
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight

      if (canvas.width !== w * dpr) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }

      const ctx = canvas.getContext('2d')

      if (! ctx) {
        return
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paint(ctx, w, h, t, canvas.dataset.raHeroWave || 'wave')
    })
  })
}
