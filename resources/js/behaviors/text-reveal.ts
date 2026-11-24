/**
 * Word reveals for `[data-ra-split]` headings.
 *
 * The reference sites bring type up through a mask, a word at a time. This
 * wraps every word in a clipping span and lets CSS stagger them with
 * `--ra-word-index`; an IntersectionObserver adds `is-revealed` once the
 * heading is on screen. Spaces stay as text nodes, so selection and screen
 * readers still read one sentence.
 *
 * Reduced motion (or no JS) leaves the heading exactly as authored.
 */
import { isReducedMotion } from './raf'

const REVEALED = 'is-revealed'

const split = (el: HTMLElement): HTMLElement[] => {
  const words: HTMLElement[] = []

  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''

      if (! text.trim()) {
        return
      }

      const fragment = document.createDocumentFragment()

      text.split(/(\s+)/).forEach((part) => {
        if (part === '') {
          return
        }

        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part))
          return
        }

        const outer = document.createElement('span')
        const inner = document.createElement('span')

        outer.className = 'c-word'
        inner.className = 'c-word__inner'
        inner.textContent = part

        outer.appendChild(inner)
        fragment.appendChild(outer)
        words.push(outer)
      })

      node.parentNode?.replaceChild(fragment, node)
      return
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk)
    }
  }

  Array.from(el.childNodes).forEach(walk)

  return words
}

export const init = (): void => {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('[data-ra-split]'))

  if (headings.length === 0) {
    return
  }

  const reveal = (el: HTMLElement): void => el.classList.add(REVEALED)

  headings.forEach((el) => {
    if (isReducedMotion()) {
      el.classList.add('is-split')
      reveal(el)
      return
    }

    const words = split(el)

    words.forEach((word, index) => {
      word.style.setProperty('--ra-word-index', String(index))
    })

    el.classList.add('is-split')

    if (! ('IntersectionObserver' in window)) {
      reveal(el)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (! entry.isIntersecting) {
          return
        }

        observer.disconnect()
        reveal(el)
      })
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })

    observer.observe(el)

    // Anchor jumps and restored scroll positions can land past the heading
    // without ever intersecting it; reveal anything already above the fold.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      observer.disconnect()
      reveal(el)
    }
  })
}
