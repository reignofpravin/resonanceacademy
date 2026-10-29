/**
 * Ambient birdsong layer — small colorful songbirds flying over the site.
 *
 * - Flights start on the first paint (visuals need no permission); audio
 *   waits for the visitor's first gesture (browser autoplay policy).
 * - Every bird crosses the viewport on a gentle sine arc (Web Animations API)
 *   while CSS flaps its two wing blades around shoulder pivots, chirping 1–3
 *   times along the way. Recordings play at a randomized rate so repeats
 *   never sound like a loop.
 * - Three species share one skeleton: american robin, goldfinch, bluebird.
 * - The muted state persists in localStorage; the floating sound button and
 *   the footer sound button stay in sync.
 * - Reduced motion disables the whole system (no flight, no sound).
 *
 * Chirp clips cut from "20130528 Vogelzwitschern Reilingen"
 * (Wikimedia Commons, CC0 1.0) — short garden-bird calls only.
 */
import { isReducedMotion } from './raf'

import chirpAUrl from '../../sounds/chirp-a.m4a?url'
import chirpBUrl from '../../sounds/chirp-b.m4a?url'
import chirpCUrl from '../../sounds/chirp-c.m4a?url'

const CLIP_URLS = [chirpAUrl, chirpBUrl, chirpCUrl]

const GAP_MS: [number, number] = [12000, 25000]
const FLIGHT_MS: [number, number] = [7000, 9000]
const MAX_CONCURRENT = 2
const VOLUME = 0.3
const PLAYBACK_RATES: [number, number] = [0.85, 1.1]
const MUTE_STORAGE_KEY = 'ra-ambient-muted'

/** aria-labels on the sound buttons */
const LABEL_ON = 'Mute birdsong'
const LABEL_OFF = 'Unmute birdsong'

const rand = (min: number, max: number): number => min + Math.random() * (max - min)
const randInt = (min: number, max: number): number => Math.round(rand(min - 0.49, max + 0.49))

/* Colorful garden-songbird flock — real bird species, hand-built in theme
   vocabulary (side view, flying right; the CSS flips the svg for leftward
   birds). Shared skeleton: far wing (behind the body, shorter), body with
   forked tail, near wing (in front of the body, longer), plus per-species
   color zones (breast/belly/cap/tail), beak and eye. Wings are drawn in the
   RAISED pose and CSS rotates them around their shoulder pivots for the
   flap. Flat fills only — no gradients, no clip-paths, no ids to collide. */

const BODY_D   = 'M47.8 14.2 45.3 11 43.2 10.4 39.5 11.4 36.5 13 27 13.9 16 16.2 7.5 13 2.4 11.8 3.8 14.8 7.6 16.6 2.5 22.2 15.4 19.4 25 21.9 36.7 21.1 43.5 19.8 46.3 18.6 47.3 17.3 47.8 14.2 52.8 15.2 47.6 16.2Z'
const WING_FAR   = 'M24.7 15.9 24 14.8 23.6 12.8 24.7 6.3 27 5.8 28.7 10.4 31 14.5Z'
const WING_NEAR  = 'M28 16.8 26.7 15.6 25.3 13.2 22.7 4.5 24.9 2.9 29.7 8 34.6 12.2Z'
const BELLY_D    = 'M15.4 19.4 22.8 21.6 28.1 22 38.8 20.8 43.5 19.8 46.4 18.5 47.3 17.1 47.8 14.4 45.3 17.2 43 18.6 39.7 19.6 26 20.4 17.1 18.3Z'
const BREAST_D   = 'M27.6 21.8 43.5 19.8 46.4 18.5 47.3 17.1 47.8 14.4 45.3 17.2 41 19.4 28.1 20.2Z'
const CAP_D      = 'M47.8 14.2 45.6 11.3 43.9 10.4 39.8 11.3 36.7 12.9 37.9 13.8 42 12.4 45.1 12.3 46.2 13.1 47.3 15.6Z'
const TAIL_D     = 'M16 16.2 7.5 13 2.4 11.8 3.8 14.8 7.6 16.6 2.5 22.2 14.8 19.6Z'
const BEAK_D     = 'M47.8 14.2 52.8 15.2 47.6 16.2Z'

const birdSvg = (body: string, zones: string, wing: string, beak: string, eye: string): string =>
  `<svg class="c-bird__svg" viewBox="0 0 72 48" aria-hidden="true">
    <path class="c-bird__wing c-bird__wing--far" d="${WING_FAR}" fill="${wing}" />
    <path d="${BODY_D}" fill="${body}" />
    ${zones}
    <path class="c-bird__wing c-bird__wing--near" d="${WING_NEAR}" fill="${wing}" />
    <path d="${BEAK_D}" fill="${beak}" />
    <circle cx="44.2" cy="13.4" r="1.1" fill="${eye}" />
  </svg>`

const BIRD_ART = [
  /* american robin: warm brown upper parts, orange throat+breast, cream belly */
  birdSvg(
    '#7d6a58',
    `<path d="${TAIL_D}" fill="#66574a" /><path d="${BELLY_D}" fill="#eee3cd" /><path d="${BREAST_D}" fill="#d0703c" />`,
    '#4a3f34',
    '#2a231d',
    '#f2e6cf',
  ),
  /* goldfinch: bright yellow body, black cap + wings + tail, pale beak */
  birdSvg(
    '#e7ba3d',
    `<path d="${TAIL_D}" fill="#26211a" /><path d="${CAP_D}" fill="#26211a" />`,
    '#26211a',
    '#d8c69e',
    '#f7efe0',
  ),
  /* bluebird: powder-blue upper parts, rusty chin+breast, cream belly */
  birdSvg(
    '#5b83ae',
    `<path d="${BELLY_D}" fill="#ece2cd" /><path d="${BREAST_D}" fill="#b5713e" />`,
    '#2e4a66',
    '#33302b',
    '#221c16',
  ),
]

export const init = (): void => {
  if (isReducedMotion() || document.querySelector('.c-bird-layer')) {
    return
  }

  const params = new URLSearchParams(window.location.search)
  const fast = params.has('ra-birds-fast')
  const gaps: [number, number] = fast ? [700, 1400] : GAP_MS

  const layer = document.createElement('div')
  layer.className = 'c-bird-layer'
  layer.setAttribute('aria-hidden', 'true')
  document.body.appendChild(layer)

  /* ----- mute state: floating button created here + footer button in blade ----- */
  let muted = window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true'

  const stickyButton = document.createElement('button')
  stickyButton.type = 'button'
  stickyButton.className = 'c-bird-sound js-ra-sound'
  stickyButton.innerHTML = '<span class="c-bird-sound__note" aria-hidden="true">&#9834;</span>'
  document.body.appendChild(stickyButton)

  const toggles = Array.from(document.querySelectorAll<HTMLElement>('.js-ra-sound'))

  const renderMute = (): void => {
    toggles.forEach((button) => {
      button.setAttribute('aria-pressed', String(muted))
      button.setAttribute('data-muted', String(muted))
      button.setAttribute('aria-label', muted ? LABEL_OFF : LABEL_ON)
      button.title = muted ? LABEL_OFF : LABEL_ON
    })
  }

  document.addEventListener('click', (event) => {
    if (! (event.target as HTMLElement).closest?.('.js-ra-sound')) {
      return
    }

    muted = !muted

    if (muted) {
      audios.forEach((audio) => audio.pause())
    }

    window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
    renderMute()
  })

  renderMute()

  /* ----- audio pool (created lazily on first gesture) ----- */
  let audios: HTMLAudioElement[] = []

  const ensureAudio = (): void => {
    if (audios.length > 0 || ! ('Audio' in window)) {
      return
    }

    audios = CLIP_URLS.map((url) => {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audio.volume = VOLUME

      return audio
    })
  }

  const chirp = (): void => {
    if (muted || document.hidden) {
      return
    }

    const idle = audios.filter((audio) => audio.paused)
    const audio = idle[Math.floor(Math.random() * idle.length)]

    if (! audio) {
      return
    }

    audio.playbackRate = rand(...PLAYBACK_RATES)
    audio.currentTime = 0

    void audio.play().catch(() => {
      /* autoplay denial — visuals continue silently */
    })
  }

  /* ----- flights ----- */
  let active = 0
  let pending: number | null = null
  let needsRetrigger = false
  const flights = new Set<Animation>()

  const scheduleFlight = (): void => {
    if (pending !== null) {
      window.clearTimeout(pending)
    }

    needsRetrigger = false
    pending = window.setTimeout(() => {
      pending = null
      fly()
    }, rand(gaps[0], gaps[1]))
  }

  /* visuals need no permission — the sky is alive from the first paint.
     only the AUDIO waits for a visitor gesture (autoplay policy). */
  scheduleFlight()


  const fly = (): void => {
    if (active >= MAX_CONCURRENT) {
      scheduleFlight()
      return
    }

    if (document.hidden) {
      needsRetrigger = true
      return
    }

    launchBird()

    /* a flock-mate often takes off right behind the first */
    if (active < MAX_CONCURRENT && Math.random() < 0.35) {
      window.setTimeout(() => {
        if (! document.hidden && active < MAX_CONCURRENT) {
          launchBird()
        }
      }, rand(250, 900))
    }
  }

  const launchBird = (): void => {
    const goingRight = Math.random() < 0.5
    const width = window.innerWidth
    const height = window.innerHeight
    const startX = goingRight ? -60 : width + 60
    const endX = goingRight ? width + 60 : -60
    const y0 = rand(6, 46) / 100 * height
    const bob = rand(4, 10)
    const duration = rand(FLIGHT_MS[0], FLIGHT_MS[1])
    const phase = Math.random() * Math.PI * 2

    const bird = document.createElement('div')
    bird.className = 'c-bird'
    bird.innerHTML = BIRD_ART[Math.floor(Math.random() * BIRD_ART.length)]
    bird.style.setProperty('--ra-bird-size', `${Math.round(rand(30, 48))}px`)
    bird.style.setProperty('--ra-flap', rand(0.85, 1.15).toFixed(2))

    const svg = bird.querySelector('svg')

    if (svg) {
      svg.style.transform = goingRight ? '' : 'scaleX(-1)'
    }

    layer.appendChild(bird)

    const frames = Array.from({ length: 28 }, (_, i) => {
      const step = i / 27
      const x = startX + (endX - startX) * step
      const bobbing = Math.sin(Math.PI * 3 * step + phase)
      const y = y0 * (1 - 0.1 * Math.sin(Math.PI * step)) + bob * bobbing

      /* gentle body sway echoing the bob — keeps silhouettes alive in flight */
      return { transform: `translate(${x}px, ${y}px) rotate(${bobbing * 4}deg)` }
    })

    const flight = bird.animate(frames, { duration, easing: 'linear' })
    active += 1
    flights.add(flight)

    /* 1–3 chirps somewhere along the pass */
    const chirpCount = randInt(1, 3)

    for (let i = 0; i < chirpCount; i += 1) {
      window.setTimeout(chirp, duration * rand(0.15, 0.85))
    }

    void flight.finished.then(() => {
      bird.remove()
      active -= 1
      flights.delete(flight)

      if (pending === null) {
        scheduleFlight()
      }
    }).catch(() => {
      bird.remove()
      active -= 1
      flights.delete(flight)
    })
  }

  /* pause the whole scene while the tab is hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (pending !== null) {
        window.clearTimeout(pending)
        pending = null
        needsRetrigger = true
      }

      flights.forEach((flight) => flight.pause())
      audios.forEach((audio) => {
        if (! audio.paused) {
          audio.pause()
        }
      })

      return
    }

    flights.forEach((flight) => {
      void flight.play().catch(() => {})
    })

    if (needsRetrigger) {
      scheduleFlight()
    }
  })

  /* ----- arm audio on the first user gesture (autoplay permission) ----- */
  let audioArmed = false

  const armAudio = (): void => {
    if (audioArmed) {
      return
    }

    audioArmed = true
    ensureAudio()
  }

  window.addEventListener('pointerdown', armAudio, { once: true, passive: true })
  window.addEventListener('keydown', armAudio, { once: true })
  window.addEventListener('scroll', armAudio, { once: true, passive: true })
}
