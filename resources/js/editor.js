/**
 * Resonance Academy block-editor registry.
 *
 * One entry registers every ra/* block using the globbed index.js modules
 * under resources/js/blocks/<kebab>/ — each module self-registers via
 * registerBlockType(metadata, settings) where metadata is its sibling
 * block.json. Custom category `resonance` keeps the academy blocks grouped.
 */
import { addFilter } from '@wordpress/hooks'

const withResonanceCategory = (categories) => [
  {
    slug: 'resonance',
    title: 'Resonance Academy',
    icon: 'open-folder',
  },
  ...categories,
]

addFilter('blocks.getCategories', 'ra-theme/blocks/categories', withResonanceCategory)

const modules = import.meta.glob('./blocks/*/index.js', {
  eager: true,
})

// Each block module exports a `registerXxx()` initializer; call every
// exported function that begins with `register` once, in stable order.
Object.values(modules).forEach((mod) => {
  Object.entries(mod).forEach(([name, initializer]) => {
    if (name.startsWith('register') && typeof initializer === 'function') {
      initializer()
    }
  })
})

export default modules
