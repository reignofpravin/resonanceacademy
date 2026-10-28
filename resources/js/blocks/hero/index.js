/**
 * ra/hero — self-registering block (metadata + React editor).
 */
import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

import blockJson from './block.json'
import HeroEdit from './edit.jsx'

export function registerHero() {
  registerBlockType(blockJson.name, {
    ...blockJson,
    edit: HeroEdit,
    save: () => null,
  })
}

export { useBlockProps, InnerBlocks }
