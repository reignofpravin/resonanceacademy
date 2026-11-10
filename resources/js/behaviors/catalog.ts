/**
 * Course catalog — instant filtering for `[data-ra-catalog]`.
 *
 * A shared ink pill glides between the active chip in each facet group
 * (measured once per state change, animated on an expo.out spring). Rows
 * leaving the filter dissolve with a blur + lift; returning rows reveal
 * with a clip-path wipe and rise. Rows below the fold reveal themselves
 * as they scroll into view, so the long list animates the whole way down.
 * State mirrors into the query string (shareable, bookmarkable) and is
 * re-applied from the URL on load. Reduced motion degrades to show/hide.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { isReducedMotion } from './raf'

gsap.registerPlugin(ScrollTrigger)

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

/** Re-clamp the ghost numerals 01… on the currently visible rows. */
const renumber = (rows: NodeListOf<HTMLElement>, skip: Iterable<HTMLElement> = []): void => {
  const excluded = new Set(skip)
  let index = 0

  rows.forEach((row) => {
    if (row.style.display === 'none' || excluded.has(row)) {
      return
    }

    index += 1
    row.querySelector<HTMLElement>('.m-catalog__num')?.replaceChildren(String(index).padStart(2, '0'))
  })
}

/** One clip-wipe reveal, shared by scroll entrances and filter returns. */
const wipeIn = (rows: HTMLElement[], delay = 0): void => {
  gsap.fromTo(
    rows,
    { autoAlpha: 0, y: 26, clipPath: 'inset(0% 0% 100% 0%)' },
    {
      autoAlpha: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.65,
      delay,
      ease: 'expo.out',
      stagger: 0.05,
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(rows, { clearProps: 'clipPath,transform,visibility,filter' })
        ScrollTrigger.refresh()
      },
    },
  )
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

  if (! rows.length || ! list) {
    return
  }

  const state = readState()
  const reduced = isReducedMotion()

  // --- Gliding pill, one per facet group ----------------------------------

  const groups: Array<{ key: FacetKey; options: HTMLElement; glide: HTMLElement }> = []

  root.querySelectorAll<HTMLElement>('.m-catalog__options').forEach((options) => {
    const chip = options.querySelector<HTMLElement>('[data-ra-filter]')

    if (! chip?.dataset.raFilter) {
      return
    }

    const glide = document.createElement('span')
    glide.className = 'm-catalog__glide'
    options.prepend(glide)

    groups.push({ key: chip.dataset.raFilter as FacetKey, options, glide })
  })

  const poseGlide = (key: FacetKey, animate: boolean): void => {
    const group = groups.find((candidate) => candidate.key === key)

    if (! group) {
      return
    }

    const active = group.options.querySelector<HTMLElement>('.m-catalog__chip.is-active')

    if (! active) {
      gsap.to(group.glide, { opacity: 0, duration: animate ? 0.2 : 0 })

      return
    }

    gsap.to(group.glide, {
      x: active.offsetLeft,
      y: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight,
      opacity: 1,
      duration: animate ? 0.5 : 0,
      ease: 'expo.out',
    })
  }

  const setTabs = (key: FacetKey, activeValue: string, animate = true): void => {
    chips.forEach((chip) => {
      if (chip.dataset.raFilter !== key) {
        return
      }

      const isActive = chip.dataset.raValue === activeValue
      chip.classList.toggle('is-active', isActive)
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })

    poseGlide(key, animate)
  }

  if (! reduced) {
    window.addEventListener('resize', () => {
      FACETS.forEach((key) => poseGlide(key, false))
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
          y: -12,
          scale: 0.985,
          filter: 'blur(6px)',
          duration: 0.28,
          ease: 'power2.in',
          onComplete: () => {
            row.style.display = 'none'
            gsap.set(row, { y: 0, scale: 1, filter: 'none' })
          },
        })
      } else {
        row.style.display = 'none'
      }
    })

    staying.forEach((row) => {
      const wasHidden = row.style.display === 'none'

      row.style.display = ''
      row.dataset.raRevealed = '1'

      if (! wasHidden) {
        if (animate) {
          gsap.set(row, { clearProps: 'filter' })
        }

        return
      }

      entering.push(row)
    })

    renumber(rows, leaving)

    if (animate && entering.length > 0) {
      wipeIn(entering)
    } else {
      ScrollTrigger.refresh()
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

    if (clear) {
      const dirty = FACETS.some((key) => state[key] !== ALL) || state.q.trim() !== ''
      clear.dataset.raActive = dirty ? 'true' : 'false'
    }

    writeState(state)
  }

  // --- Initial state (from the query string) ----------------------------

  FACETS.forEach((key) => setTabs(key, state[key], false))

  if (search) {
    search.value = state.q
  }

  // Collapse non-matching rows before the scroll reveal so a deep link
  // (?track=guitar) opens on its subset alone.
  if (FACETS.some((key) => state[key] !== ALL) || state.q !== '') {
    rows.forEach((row) => {
      if (! testRow(row, state)) {
        row.style.display = 'none'
      } else {
        row.dataset.raRevealed = '1'
      }
    })
  }

  if (countNode) {
    countNode.replaceChildren(String(Array.from(rows).filter((row) => row.style.display !== 'none').length))
  }

  // --- Scroll entrances: each row wipe-reveals as it enters --------------

  if (! reduced) {
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (! entry.isIntersecting) {
          return
        }

        const row = entry.target as HTMLElement
        rowObserver.unobserve(row)

        if (row.dataset.raRevealed === '1' || row.style.display === 'none') {
          return
        }

        row.dataset.raRevealed = '1'
        gsap.killTweensOf(row)
        wipeIn([row])
      })
    }, { threshold: 0.06, rootMargin: '0px 0px 0px 0px' })

    rows.forEach((row) => rowObserver.observe(row))
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
        setTabs(key, ALL, false)
      })

      state.q = ''

      if (search) {
        search.value = ''
      }

      apply({ animate: false })
    })
  }
}
