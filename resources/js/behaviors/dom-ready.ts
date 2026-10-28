/**
 * Tiny wrapper over the classic WordPress domReady event.
 */
export const domReady = (cb: () => void): void => {
  if (document.readyState !== 'loading') {
    cb()
    return
  }

  document.addEventListener('DOMContentLoaded', cb, { once: true })
}

export default domReady
