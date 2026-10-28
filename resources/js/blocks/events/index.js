/**
 * ra/events — self-registering block.
 */
import { registerBlockType } from '@wordpress/blocks'

import blockJson from './block.json'
import Edit from './edit.jsx'

export function registerEvents() {
  registerBlockType(blockJson.name, {
    ...blockJson,
    edit: Edit,
    save: () => null,
  })
}
