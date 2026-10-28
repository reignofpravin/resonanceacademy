/**
 * ra/stats — self-registering block.
 */
import { registerBlockType } from '@wordpress/blocks'

import blockJson from './block.json'
import Edit from './edit.jsx'

export function registerStats() {
  registerBlockType(blockJson.name, {
    ...blockJson,
    edit: Edit,
    save: () => null,
  })
}
