/**
 * ra/contact — self-registering block.
 */
import { registerBlockType } from '@wordpress/blocks'

import blockJson from './block.json'
import Edit from './edit.jsx'

export function registerContact() {
  registerBlockType(blockJson.name, {
    ...blockJson,
    edit: Edit,
    save: () => null,
  })
}
