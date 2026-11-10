/**
 * Program cards — cursor spotlight + gentle 3D tilt for `[data-ra-block-programs]`.
 *
 * Each card tracks the pointer: a radial spotlight follows via `--mx/--my`
 * CSS custom properties, and gsap.quickTo springs the card through a small
 * lift + tilt so movement feels weighty but responsive. Reduced motion is
 * left entirely to the CSS (spotlight keeps working without the tilt).
 */
import gsap from 'gsap'

import { isReducedMotion } from './raf'

const LIFT = -8
const TILT_X = 4 // deg, pointer vertically sweeps ±
const TILT_Y = 5 // deg, pointer horizontally sweeps ±

export const init = (): void => {
  document.querySelectorAll<HTMLElement>('[data-ra-block-programs]').forEach((list) => {
    setup(list)
  })
}

const setup = (list: HTMLElement): void => {
  const cards = list.querySelectorAll<HTMLElement>('.m-programs__card')

  if (! cards.length) {
    return
  }

  cards.forEach((card) => {
    gsap.set(card, { transformPerspective: 900 })

    const toY = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3.out' })
    const toRX = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power3.out' })
    const toRY = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power3.out' })

    if (! isReducedMotion()) {
      card.addEventListener('pointerenter', () => {
        toY(LIFT)
      })

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height

        card.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`)
        card.style.setProperty('--my', `${(py * 100).toFixed(2)}%`)

        toRX((0.5 - py) * TILT_X * 2)
        toRY((px - 0.5) * TILT_Y * 2)
      })

      card.addEventListener('pointerleave', () => {
        toY(0)
        toRX(0)
        toRY(0)
      })
    }
  })
}
