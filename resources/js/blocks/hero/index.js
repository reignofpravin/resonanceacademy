/**
 * ra/hero — self-registering block (metadata + React editor).
 */
import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor'

import blockJson from './block.json'
import HeroEdit from './edit.jsx'

// eslint-disable-next-line jsdoc/require-jsdoc
export function registerHero() {
  registerBlockType(blockJson.name, {
    ...blockJson,
    edit: HeroEdit,
    save: () => null,
  })
}

export { useBlockProps, InnerBlocks }
