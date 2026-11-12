/**
 * Site header state.
 *
 * - Toggles `.is-scrolled` on `.js-ra-header` once the page is scrolled (the
 *   floating plates lift on a soft shadow while content slides beneath).
 * - The menu is a CSS checkbox disclosure; clicks inside the overlay links
 *   uncheck it, and Escape closes it for keyboard users.
 */

const SCROLL_TRIGGER = 8;

export const init = (): void => {
  const header = document.querySelector<HTMLElement>('.js-ra-header')

  if (! header) {
    return
  }

  const checkbox = document.querySelector<HTMLInputElement>('.js-ra-nav-toggle')

  const update = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_TRIGGER)
  }

  update()
  window.addEventListener('scroll', update, { passive: true })

  // Pinned content bars tuck under the header using its measured height. The
  // nominal rem offset is right most of the time, but around 320px the two
  // floating plates squeeze the logo, leaving the collapsed header ~20px
  // shorter and a visible gap above the bar. ResizeObserver keeps the two in
  // step through that squeeze, the logo transition and viewport resizes.
  const syncOffset = (): void => {
    const height = header.getBoundingClientRect().height

    document.documentElement.style.setProperty('--ra-header-collapsed', `${Math.max(0, height - 2)}px`)
  }

  syncOffset()

  if ('ResizeObserver' in window) {
    new ResizeObserver(syncOffset).observe(header)
  } else {
    window.addEventListener('resize', syncOffset)
  }

  if (! checkbox) {
    return
  }

  header.addEventListener('click', (event) => {
    if (! (event.target as HTMLElement).closest('.m-menu-overlay a, .m-menu-overlay .btn')) {
      return
    }

    checkbox.checked = false
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && checkbox.checked) {
      checkbox.checked = false
    }
  })
}
