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
