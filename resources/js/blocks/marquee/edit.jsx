/**
 * ra/marquee editor.
 */
import { __ } from '@wordpress/i18n'
import { TextControl, Button, PanelBody } from '@wordpress/components'
import { InspectorControls, useBlockProps } from '@wordpress/block-editor'

const Edit = ({ attributes, setAttributes }) => {
  const { items, duration } = attributes
  const blockProps = useBlockProps({ className: 'c-marquee m-ra-placeholder' })

  const updateItem = (index, text) => {
    setAttributes({ items: items.map((item, i) => (i === index ? { ...item, text } : item)) })
  }

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={ __('Marquee', 'ra-theme') } initialOpen>
          <TextControl
            label={ __('Seconds per lap', 'ra-theme') }
            value={ String(duration || 30) }
            onChange={ (value) => setAttributes({ duration: Math.max(10, parseInt(value, 10) || 30) }) }
          />
          <hr />
          { (items ?? []).map((item, index) => (
            <div key={ index } style={ { marginBottom: '0.5rem' } }>
              <TextControl
                label={ `${ __('Phrase', 'ra-theme') } ${ index + 1 }` }
                value={ item?.text ?? '' }
                onChange={ (text) => updateItem(index, text) }
              />
              <Button isDestructive variant="link" onClick={ () => setAttributes({ items: items.filter((_, i) => i !== index) }) }>
                { __('Remove', 'ra-theme') }
              </Button>
            </div>
          )) }
          <Button variant="primary" onClick={ () => setAttributes({ items: [...(items ?? []), { text: '' }] }) }>
            { __('Add phrase', 'ra-theme') }
          </Button>
        </PanelBody>
      </InspectorControls>

      <p>{ __('Ticker strip renders server-side — phrases:', 'ra-theme') } { (items ?? []).map((item) => item?.text).filter(Boolean).join(' ♪ ') || __('(none yet)', 'ra-theme') }</p>
    </section>
  )
}

export default Edit
