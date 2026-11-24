/**
 * Count-up numerals for `[data-ra-count]`.
 *
 * Runs once when the numeral enters the viewport; under reduced motion the
 * numeral simply shows its final value. Numerals also marked `[data-ra-roll]`
 * count as odometers instead: each digit becomes a vertical reel of 0–9 that
 * spins down and lands on its final figure, left digits spinning longest.
 */
import { isReducedMotion, onFrame } from './raf'

const easeOut = (p: number): number => 1 - Math.pow(1 - p, 3)

const format = (value: number, el: HTMLElement): string => {
  const decimals = parseInt(el.dataset.raCountDecimals ?? '0', 10)
  const suffix = el.dataset.raCountSuffix ?? ''

  return value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }) + suffix
}

type Reel = {
  spin: number
  digit: number
  column: HTMLElement
}

/**
 * Replace the numeral with per-digit reels. Static characters (commas, "%",
 * "K+") stay as they are. Each reel stacks the digits enough times to cover
 * its own spin, so the landing position always exists.
 */
const buildReels = (el: HTMLElement, finalText: string): Reel[] => {
  el.textContent = ''

  const reels: Reel[] = []
  let digitIndex = 0

  finalText.split('').forEach((char) => {
    if (! /\d/.test(char)) {
      el.appendChild(document.createTextNode(char))
      return
    }

    const spin = 2 + Math.max(0, 3 - digitIndex) // leftmost digits travel farthest
    const digit = Number(char)
    const repeats = spin + 1

    const window_ = document.createElement('span')
    window_.className = 'c-digit'

    const column = document.createElement('span')
    column.className = 'c-digit__col'

    for (let r = 0; r < repeats; r += 1) {
      for (let d = 0; d < 10; d += 1) {
        const cell = document.createElement('span')
        cell.className = 'c-digit__cell'
        cell.textContent = String(d)
        column.appendChild(cell)
      }
    }

    window_.appendChild(column)
    el.appendChild(window_)
    reels.push({ spin, digit, column })
    digitIndex += 1
  })

  return reels
}

const runRoll = (el: HTMLElement, target: number, duration: number): void => {
  const reels = buildReels(el, format(target, el))

  if (reels.length === 0) {
    return
  }

  const height = reels[0].column.firstElementChild?.getBoundingClientRect().height || 1
  let elapsed = 0

  const stop = onFrame((_, delta) => {
    elapsed += delta

    const progress = Math.min(1, elapsed / duration)
    const eased = easeOut(progress)

    reels.forEach((reel) => {
      const landing = reel.spin * 10 + reel.digit
      const position = landing * eased

      reel.column.style.transform = `translate3d(0, ${(-position * height).toFixed(2)}px, 0)`
    })

    if (progress >= 1) {
      stop()
    }
  })
}

const runCounter = (el: HTMLElement): void => {
  const target = parseFloat(el.dataset.raCount ?? '0')
  const duration = Math.max(0.001, parseFloat(el.dataset.raCountDuration ?? '1.6'))

  if (el.dataset.raRoll !== undefined) {
    runRoll(el, target, duration)
    return
  }

  let elapsed = 0

  const stop = onFrame((_, delta) => {
    elapsed += delta

    const progress = Math.min(1, elapsed / duration)

    el.textContent = format(target * easeOut(progress), el)

    if (progress >= 1) {
      stop()
    }
  })
}

export const init = (): void => {
  if (isReducedMotion()) {
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        runCounter(entry.target as HTMLElement)
      }
    })
  }, { threshold: 0.4 })

  document.querySelectorAll<HTMLElement>('[data-ra-count]').forEach((el) => {
    // Reserve the final value so layout never shifts while counting
    el.textContent = format(parseFloat(el.dataset.raCount ?? '0'), el)
    observer.observe(el)
  })
}
