/**
 * Course catalog — instant filtering for `[data-ra-catalog]`.
 *
 * A single pinned toolbar carries the search field, the facet disclosure and
 * the result count; the facets themselves live in one wrapping line that the
 * disclosure reveals (and which stays open without JS). Rows leaving the
 * filter fade out, returning rows fade back in; the list is otherwise static.
 * State mirrors into the query string (shareable, bookmarkable) and is
 * re-applied from the URL on load. Reduced motion degrades to show/hide.
 */
import gsap from 'gsap'

import { isReducedMotion } from './raf'

type FacetKey = 'track' | 'level' | 'path'
type State = Record<FacetKey, string> & { q: string }

const ALL = 'all'
const SEARCH_DEBOUNCE = 220

const FACETS: FacetKey[] = ['track', 'level', 'path']

const readState = (): State => {
  const params = new URLSearchParams(window.location.search)

  return {
    track: params.get('track') || ALL,
    level: params.get('level') || ALL,
    path: params.get('path') || ALL,
    q: params.get('q') || '',
  }
}

const writeState = (state: State): void => {
  const params = new URLSearchParams()

  FACETS.forEach((key) => {
    if (state[key] !== ALL) {
      params.set(key, state[key])
    }
  })

  if (state.q !== '') {
    params.set('q', state.q)
  }

  const query = params.toString()
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
}

/** Whether a row satisfies the current facets + search string. */
const testRow = (row: HTMLElement, state: State): boolean => {
  for (const key of FACETS) {
    if (state[key] !== ALL && ! row.dataset[key].split(' ').includes(state[key])) {
      return false
    }
  }

  const needle = state.q.trim().toLowerCase()

  if (needle !== '' && ! row.dataset.search.includes(needle)) {
    return false
  }

  return true
}

/** Filter results fade in; nothing animates on scroll. */
const fadeIn = (rows: HTMLElement[]): void => {
  gsap.fromTo(rows, { autoAlpha: 0 }, {
    autoAlpha: 1,
    duration: 0.24,
    ease: 'power2.out',
    overwrite: 'auto',
    onComplete: () => gsap.set(rows, { clearProps: 'opacity,visibility' }),
  })
}

export const init = (): void => {
  document.querySelectorAll<HTMLElement>('[data-ra-catalog]').forEach((root) => {
    setup(root)
  })
}

const setup = (root: HTMLElement): void => {
  const rows = root.querySelectorAll<HTMLElement>('[data-ra-row]')
  const list = root.querySelector<HTMLElement>('[data-ra-catalog-list]')
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ra-filter]'))
  const search = root.querySelector<HTMLInputElement>('.js-catalog-search')
  const clear = root.querySelector<HTMLButtonElement>('.js-catalog-clear')
  const countNode = root.querySelector<HTMLElement>('[data-ra-catalog-count]')
  const empty = root.querySelector<HTMLElement>('[data-ra-empty]')
  const bar = root.querySelector<HTMLElement>('[data-ra-catalog-bar]')
  const toggle = root.querySelector<HTMLButtonElement>('.js-catalog-toggle')
  const badge = root.querySelector<HTMLElement>('.js-catalog-filter-count')

  if (! rows.length || ! list) {
    return
  }

  const state = readState()
  const reduced = isReducedMotion()

  const setTabs = (key: FacetKey, activeValue: string): void => {
    chips.forEach((chip) => {
      if (chip.dataset.raFilter !== key) {
        return
      }

      const isActive = chip.dataset.raValue === activeValue
      chip.classList.toggle('is-active', isActive)
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })
  }

  // --- Collapsible facet panel --------------------------------------------

  const activeFacets = (): number => FACETS.filter((key) => state[key] !== ALL).length

  const setPanel = (open: boolean): void => {
    if (! bar) {
      return
    }

    bar.classList.toggle('is-filters-open', open)
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  const syncBadge = (): void => {
    const count = activeFacets()

    if (! badge) {
      return
    }

    badge.textContent = String(count)
    badge.hidden = count === 0
  }

  const syncClear = (): void => {
    if (! clear) {
      return
    }

    const dirty = FACETS.some((key) => state[key] !== ALL) || state.q.trim() !== ''
    clear.dataset.raActive = dirty ? 'true' : 'false'
  }

  if (bar) {
    bar.dataset.raFilters = 'ready'
  }

  toggle?.addEventListener('click', () => {
    setPanel(! bar?.classList.contains('is-filters-open'))
  })

  if (bar && toggle) {
    bar.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && bar.classList.contains('is-filters-open')) {
        setPanel(false)
        toggle.focus()
      }
    })
  }

  const apply = (options: { animate?: boolean } = {}): void => {
    const animate = (options.animate ?? true) && ! reduced

    const leaving: HTMLElement[] = []
    const staying: HTMLElement[] = []
    const entering: HTMLElement[] = []

    rows.forEach((row) => {
      ;(testRow(row, state) ? staying : leaving).push(row)
    })

    rows.forEach((row) => gsap.killTweensOf(row))

    leaving.forEach((row) => {
      if (row.style.display === 'none') {
        return
      }

      if (animate) {
        gsap.to(row, {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power1.out',
          onComplete: () => {
            row.style.display = 'none'
          },
        })
      } else {
        row.style.display = 'none'
      }
    })

    staying.forEach((row) => {
      const wasHidden = row.style.display === 'none' || row.style.visibility === 'hidden'

      row.style.display = ''

      if (! wasHidden) {
        return
      }

      entering.push(row)
    })

    // Every surviving row has just had its tween killed, so any inline
    // opacity/visibility from a half-finished fade must go. Without this,
    // `apply({ animate: false })` (Clear) would restore `display` on rows the
    // previous fade-out left at autoAlpha 0 and strand them invisible.
    gsap.set(staying, { clearProps: 'opacity,visibility' })

    if (animate && entering.length > 0) {
      fadeIn(entering)
    }

    if (countNode) {
      countNode.replaceChildren(String(staying.length))

      if (animate) {
        gsap.fromTo(
          countNode,
          { yPercent: -24, autoAlpha: 0.2 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' },
        )
      }
    }

    if (empty) {
      empty.hidden = staying.length > 0
    }

    syncClear()
    syncBadge()
    writeState(state)
  }

  // --- Initial state (from the query string) ----------------------------

  FACETS.forEach((key) => setTabs(key, state[key]))

  if (search) {
    search.value = state.q
  }

  // A shared link with facets selected opens the panel so the choice is
  // visible rather than hidden behind the toggle.
  if (activeFacets() > 0) {
    setPanel(true)
  }

  syncBadge()
  syncClear()

  // Collapse non-matching rows before paint so a deep link (?track=guitar)
  // opens on its subset alone.
  if (FACETS.some((key) => state[key] !== ALL) || state.q !== '') {
    rows.forEach((row) => {
      if (! testRow(row, state)) {
        row.style.display = 'none'
      }
    })
  }

  if (countNode) {
    countNode.replaceChildren(String(Array.from(rows).filter((row) => row.style.display !== 'none').length))
  }

  // --- Interactions -------------------------------------------------------

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.raFilter as FacetKey | undefined

      if (! key) {
        return
      }

      const value = chip.dataset.raValue ?? ALL

      state[key] = value === ALL ? ALL : (state[key] === value ? ALL : value)
      setTabs(key, state[key])
      apply()
    })
  })

  if (search) {
    let timer = 0

    search.addEventListener('input', () => {
      window.clearTimeout(timer)

      timer = window.setTimeout(() => {
        state.q = search.value.trim()
        apply()
      }, SEARCH_DEBOUNCE)
    })
  }

  if (clear) {
    clear.addEventListener('click', () => {
      FACETS.forEach((key) => {
        state[key] = ALL
        setTabs(key, ALL)
      })

      state.q = ''

      if (search) {
        search.value = ''
      }

      apply({ animate: false })
    })
  }
}
