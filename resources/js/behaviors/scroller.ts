/**
 * Generic scroll-snap scroller.
 *
 * Container: `[data-ra-scroller]` (or `.js-ra-instructors` legacy hook).
 * Buttons: `[data-ra-scroller-prev]` / `[data-ra-scroller-next]` scroll the
 * track by its first card's width. Motion is reduced under the media query.
 */
export const init = (): void => {
  document.querySelectorAll<HTMLElement>('[data-ra-scroller], .js-ra-instructors').forEach((track) => {
    const container = track.closest('[data-ra-block]') ?? track.parentElement

    if (! container) {
      return
    }

    const buttons = container.querySelectorAll<HTMLButtonElement>('[data-ra-scroller-prev], [data-ra-scroller-next], [class*="js-ra-instructors-"]')

    const step = (): number => {
      const firstCard = track.firstElementChild as HTMLElement | null

      return firstCard ? firstCard.getBoundingClientRect().width + 24 : 280
    }

    buttons.forEach((button) => {
      const isPrev = button.hasAttribute('data-ra-scroller-prev') || button.classList.contains('js-ra-instructors-prev')

      button.addEventListener('click', () => {
        track.scrollBy({ left: isPrev ? -step() : step(), behavior: 'smooth' })
      })
    })
  })
}
