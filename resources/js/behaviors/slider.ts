/**
 * Quote slider for `[data-ra-block="testimonials"]`.
 *
 * Slides: `[data-ra-slider-slide]`, dots: `[data-ra-slider-dot]`, arrows:
 * `.js-ra-slider-prev` / `.js-ra-slider-next`. Auto-advances on
 * `data-ra-slider-interval` seconds and pauses on hover/focus and whenever
 * the section leaves the viewport. Reduced motion: no auto-advance (arrows
 * and dots still swap instantly).
 */

const activeClass = 'is-active'

export const init = (): void => {
  document.querySelectorAll<HTMLElement>('[data-ra-block="testimonials"]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-ra-slider-slide]'))

    if (slides.length === 0) {
      return
    }

    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ra-slider-dot]'))
    const interval = parseFloat(root.dataset.raSliderInterval ?? '8')

    let index = 0
    let hoverPaused = false
    let visible = true

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rendered = slides.length

    const select = (next: number): void => {
      const target = ((next % rendered) + rendered) % rendered

      if (target === index) {
        return
      }

      slides[index].classList.remove(activeClass)
      slides[index].setAttribute('aria-hidden', 'true')
      slides[index].hidden = true

      dots[index]?.classList.remove(activeClass)
      dots[index]?.setAttribute('aria-selected', 'false')

      slides[target].classList.add(activeClass)
      slides[target].removeAttribute('aria-hidden')
      slides[target].hidden = false

      dots[target]?.classList.add(activeClass)
      dots[target]?.setAttribute('aria-selected', 'true')

      index = target
    }

    const step = (dir: number): void => select(index + dir)

    root.querySelector('.js-ra-slider-prev')?.addEventListener('click', () => step(-1))
    root.querySelector('.js-ra-slider-next')?.addEventListener('click', () => step(1))

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-selected', dotIndex === index ? 'true' : 'false')
      dot.addEventListener('click', () => select(dotIndex))
    })

    // Auto-advance loop (skipped under reduced motion)
    const shouldAutoAdvance = interval > 0 && !reduced

    let elapsed = 0
    let lastTick: number | null = null

    const tick = (now: number): void => {
      if (! shouldAutoAdvance) {
        return
      }

      if (lastTick !== null) {
        elapsed += (now - lastTick) / 1000

        if (elapsed >= interval) {
          elapsed = 0

          if (! hoverPaused && visible) {
            step(1)
          } else {
            // keep the clock reset while held, resume ticking next frame
          }
        }
      }

      lastTick = now
      requestAnimationFrame(tick)
    }

    if (shouldAutoAdvance) {
      requestAnimationFrame(tick)

      root.addEventListener('mouseenter', () => { hoverPaused = true })
      root.addEventListener('mouseleave', () => { hoverPaused = false })
      root.addEventListener('focusin', () => { hoverPaused = true })
      root.addEventListener('focusout', () => { hoverPaused = false })

      const visibility = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
      })

      visibility.observe(root)
    }
  })
}
