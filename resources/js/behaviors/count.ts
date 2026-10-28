/**
 * Count-up numerals for `[data-ra-count]`.
 *
 * Runs once when the numeral enters the viewport; under reduced motion the
 * numeral simply shows its final value.
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

const runCounter = (el: HTMLElement): void => {
  const target = parseFloat(el.dataset.raCount ?? '0')
  const duration = Math.max(0.001, parseFloat(el.dataset.raCountDuration ?? '1.6'))
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
