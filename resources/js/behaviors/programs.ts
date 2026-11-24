/**
 * Programme deck — "Now Playing".
 *
 * With JS the section becomes a 3D band of sleeves: a float `pos` springs
 * toward `target`, and every card's offset, depth, turn, scale, opacity and
 * blur are plain CSS variables set from its distance to the centre. Drag
 * (or a horizontal wheel, arrow keys, the transport, the instrument index)
 * scrubs the deck; the centred card's vinyl slides out and spins, the gold
 * strings thrum once on every snap, and the spectrum canvas — stage-light
 * sparks in brass, cyan and a little magenta — surges with scrub velocity.
 * Idle for a while and the turntable keeps playing on its own, ping-ponging
 * along the shelf.
 *
 * Without JS — or with reduced motion — none of this runs: the rail stays
 * the plain scrollable row the stylesheet lays out by default.
 */
import gsap from 'gsap'

import { isReducedMotion, onFrame } from './raf'

const BRASS = '214, 166, 60'
const CYAN = '108, 196, 255'
const MAGENTA = '226, 120, 214'

const SPRING = 6.5 // how hungrily pos chases target
const MAX_ANGLE = 40 // deg a far card turns away
const DEPTH = 240 // px each step recedes
const AUTOPLAY = 4.5 // seconds a track holds before the deck flips it
const WAKE = 8 // seconds a manual nudge silences the turntable
const SOFT = 0.35 // how far past the ends a drag may stretch
const FLING = 0.22 // seconds of release velocity kept for the snap

type Spark = {
  x: number
  y: number
  r: number
  alpha: number
  phase: number
  colour: string
  flare: boolean
}

const pad = (n: number): string => String(n + 1).padStart(2, '0')

const initDeck = (stage: HTMLElement): void => {
  const section = stage.closest<HTMLElement>('.m-programs')
  const rail = stage.querySelector<HTMLElement>('[data-ra-rail]')
  const cards = rail ? Array.from(rail.querySelectorAll<HTMLElement>('[data-ra-card]')) : []

  if (! section || ! rail || cards.length < 2) {
    return
  }

  const canvas = stage.querySelector<HTMLCanvasElement>('[data-ra-spectrum]')
  const ctx = canvas?.getContext('2d') ?? null
  const strings = stage.querySelector<HTMLElement>('[data-ra-strings]')
  const scrub = stage.querySelector<HTMLElement>('[data-ra-scrub]')
  const counter = section.querySelector<HTMLElement>('[data-ra-counter]')
  const side = section.querySelector<HTMLElement>('[data-ra-side]')
  const jumps = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-ra-jump]'))

  const n = cards.length
  const half = Math.ceil(n / 2)

  let pos = 0
  let target = 0
  let pitch = 300
  let center = -1
  let direction = 1
  let hovered = false
  let dragging = false
  let movedFar = false
  let suppressClick = false
  let dragX = 0
  let dragT = 0
  let dragVel = 0
  let wakeAt = 0
  let auto = AUTOPLAY
  let surge = 0
  let elapsed = 0
  let visible = true
  let width = 0
  let height = 0
  let sparks: Spark[] = []
  let wheelSnap = 0

  const wake = (): void => {
    wakeAt = performance.now() + WAKE * 1000
    auto = AUTOPLAY

    // Only announce track flips once a human starts flipping them —
    // a turntable that self-plays must not chat at screen readers.
    counter?.setAttribute('aria-live', 'polite')
  }

  const clamp = (v: number): number => Math.min(n - 1, Math.max(0, v))
  const clampSoft = (v: number): number => Math.min(n - 1 + SOFT, Math.max(-SOFT, v))

  const measure = (): void => {
    const gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 20

    pitch = (cards[0].getBoundingClientRect().width || 280) + gap
  }

  const strum = (): void => {
    if (! strings) {
      return
    }

    strings.classList.remove('is-strum')
    void strings.offsetWidth
    strings.classList.add('is-strum')
  }

  const setCenter = (i: number, silent = false): void => {
    if (i === center) {
      return
    }

    center = i
    cards.forEach((card, ci) => card.classList.toggle('is-center', ci === i))

    if (counter) {
      counter.textContent = pad(i)
    }

    if (side) {
      side.textContent = i < half ? 'SIDE A' : 'SIDE B'
    }

    jumps.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.raJump) === i))

    if (! silent) {
      strum()
    }
  }

  const layout = (): void => {
    cards.forEach((card, i) => {
      const d = i - pos
      const ad = Math.abs(d)
      const style = card.style

      if (ad > 3.4) {
        style.visibility = 'hidden'

        return
      }

      style.visibility = 'visible'
      style.setProperty('--tx', `${(d * pitch).toFixed(2)}px`)
      style.setProperty('--ty', `${(Math.min(1, ad) * 26).toFixed(1)}px`)
      style.setProperty('--tz', `${(-Math.min(ad, 3) * DEPTH).toFixed(1)}px`)
      style.setProperty('--ry', `${((-Math.max(-2.6, Math.min(2.6, d)) / 2.6) * MAX_ANGLE).toFixed(2)}deg`)
      style.setProperty('--sc', (1 / (1 + ad * 0.22)).toFixed(3))
      style.setProperty('--op', Math.max(0.1, 1 - ad * 0.32).toFixed(3))
      style.setProperty('--bl', ad < 0.6 ? '0px' : `${Math.min(2.6, (ad - 0.5) * 1.1).toFixed(2)}px`)
      style.zIndex = String(100 - Math.round(ad * 10))
    })

    scrub?.style.setProperty('--p', (n > 1 ? pos / (n - 1) : 0).toFixed(3))
  }

  /* ---------- scrubbing ---------- */

  const onDragMove = (event: PointerEvent): void => {
    if (! dragging) {
      return
    }

    const now = performance.now()
    const dx = event.clientX - dragX

    if (Math.abs(dx) > 6) {
      movedFar = true
      suppressClick = true
    }

    if (movedFar) {
      target = clampSoft(target - dx / pitch)

      const dt = Math.max((now - dragT) / 1000, 1 / 240)

      dragVel = -dx / pitch / dt
      dragX = event.clientX
      dragT = now
    }
  }

  const onDragEnd = (event: PointerEvent): void => {
    if (! dragging) {
      return
    }

    dragging = false

    if (event.pointerType === 'touch') {
      hovered = false // a tapped deck should re-arm the turntable
    }

    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    window.removeEventListener('pointercancel', onDragEnd)

    if (movedFar) {
      target = clamp(Math.round(pos + dragVel * FLING))
      wake()
    }
  }

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return
    }

    dragging = true
    movedFar = false
    suppressClick = false
    dragX = event.clientX
    dragT = performance.now()
    dragVel = 0
    wake()

    window.addEventListener('pointermove', onDragMove)
    window.addEventListener('pointerup', onDragEnd)
    window.addEventListener('pointercancel', onDragEnd)
  })

  stage.addEventListener('click', (event) => {
    if (suppressClick) {
      event.preventDefault()
      suppressClick = false

      return
    }

    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-ra-card]')
    const i = card ? cards.indexOf(card) : -1

    if (i >= 0 && i !== center) {
      event.preventDefault() // side sleeves get centred, not clicked through
      target = i
      wake()
    }
  })

  stage.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return // vertical scroll always belongs to the page
    }

    event.preventDefault()
    target = clampSoft(target + event.deltaX * 0.0035)
    wake()

    window.clearTimeout(wheelSnap)
    wheelSnap = window.setTimeout(() => {
      target = clamp(Math.round(target))
    }, 160)
  }, { passive: false })

  stage.addEventListener('keydown', (event) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']

    if (! keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    if (event.key === 'ArrowRight') {
      target = clamp(Math.round(target) + 1)
    } else if (event.key === 'ArrowLeft') {
      target = clamp(Math.round(target) - 1)
    } else {
      target = event.key === 'Home' ? 0 : n - 1
    }

    wake()
  })

  stage.addEventListener('focusin', (event) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-ra-card]')
    const i = card ? cards.indexOf(card) : -1

    if (i >= 0) {
      target = i
    }

    wake()
  })

  stage.addEventListener('pointerenter', () => {
    hovered = true
  })

  stage.addEventListener('pointerleave', () => {
    hovered = false
  })

  section.querySelectorAll<HTMLButtonElement>('[data-ra-prev],[data-ra-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      target = clamp(Math.round(target) + (btn.hasAttribute('data-ra-next') ? 1 : -1))
      wake()
    })
  })

  jumps.forEach((btn) => {
    btn.addEventListener('click', () => {
      target = clamp(Number(btn.dataset.raJump) || 0)
      wake()
    })
  })

  /* ---------- the spectrum behind the band ---------- */

  const seed = (): void => {
    const count = Math.round(Math.min(140, Math.max(42, (width * height) / 12000)))

    sparks = Array.from({ length: count }, (_, index) => {
      const roll = Math.random()

      return {
        x: Math.random() * width,
        y: height * (0.5 + (Math.random() - 0.5) * 0.34),
        r: 0.6 + Math.random() * 1.3,
        alpha: 0.16 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        colour: roll < 0.6 ? BRASS : roll < 0.83 ? CYAN : MAGENTA,
        flare: index % 15 === 0,
      }
    })
  }

  const resizeCanvas = (): void => {
    if (! canvas) {
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    width = stage.clientWidth
    height = stage.clientHeight

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

    seed()
  }

  const paint = (drift: number): void => {
    if (! ctx) {
      return
    }

    ctx.clearRect(0, 0, width, height)

    const amp = 1 + surge * 2.4
    const flow = drift * pitch * 0.55

    for (const spark of sparks) {
      spark.x -= flow

      if (spark.x < -20) {
        spark.x += width + 40
      } else if (spark.x > width + 20) {
        spark.x -= width + 40
      }

      const wobble = Math.sin(spark.x * 0.011 + elapsed * 0.7 + spark.phase) * (5 + 24 * surge) * (spark.r / 1.6)
      const y = spark.y + wobble
      const twinkle = 0.72 + Math.sin(elapsed * 1.25 + spark.phase) * 0.28
      const alpha = spark.alpha * twinkle

      if (spark.flare) {
        const glow = ctx.createRadialGradient(spark.x, y, 0, spark.x, y, spark.r * 8)

        glow.addColorStop(0, `rgba(${spark.colour}, ${(alpha * 0.5).toFixed(3)})`)
        glow.addColorStop(1, `rgba(${spark.colour}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(spark.x, y, spark.r * 8, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = `rgba(${spark.colour}, ${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(spark.x, y, spark.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /* ---------- the loop ---------- */

  const frame = (_now: number, delta: number): void => {
    if (! visible || document.hidden) {
      return
    }

    const dt = Math.min(delta, 0.05)

    elapsed += dt

    if (! dragging) {
      if (! hovered && performance.now() > wakeAt) {
        auto -= dt

        if (auto <= 0) {
          if (target >= n - 1) {
            direction = -1
          } else if (target <= 0) {
            direction = 1
          }

          target = clamp(Math.round(target) + direction)
          auto = AUTOPLAY
        }
      } else {
        auto = Math.max(auto, 1.4)
      }
    }

    const was = pos

    pos += (target - pos) * Math.min(1, dt * SPRING)

    if (Math.abs(target - pos) < 0.0015) {
      pos = target
    }

    const speed = Math.abs(pos - was) / Math.max(dt, 1e-4)

    surge += (Math.min(1.6, speed * 0.9) - surge) * Math.min(1, dt * (speed > surge ? 9 : 2.4))

    layout()
    setCenter(clamp(Math.round(pos)))
    paint(pos - was)
  }

  /* ---------- stage tilt ---------- */

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const toRX = gsap.quickTo(rail, 'rotationX', { duration: 0.55, ease: 'power3.out' })
    const toRY = gsap.quickTo(rail, 'rotationY', { duration: 0.55, ease: 'power3.out' })

    stage.addEventListener('pointermove', (event) => {
      if (dragging) {
        return
      }

      const rect = stage.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5

      toRY(px * 6)
      toRX(-py * 3.5)
    })

    stage.addEventListener('pointerleave', () => {
      toRX(0)
      toRY(0)
    })
  }

  /* ---------- go ---------- */

  section.classList.add('is-orbit')
  measure()
  resizeCanvas()
  layout()
  setCenter(0, true)
  onFrame(frame)

  window.addEventListener('resize', () => {
    measure()
    resizeCanvas()
    layout()
  }, { passive: true })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting
      })
    }, { threshold: 0.05 }).observe(stage)
  }
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  document.querySelectorAll<HTMLElement>('[data-ra-deck]').forEach(initDeck)
}
