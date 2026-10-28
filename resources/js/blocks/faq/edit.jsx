/**
 * ra/faq editor.
 */
import { __ } from '@wordpress/i18n'
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { TextControl, TextareaControl, Button, PanelBody } from '@wordpress/components'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, items } = attributes
  const blockProps = useBlockProps({ className: 'm-faq' })

  const updateItem = (index, patch) => {
    setAttributes({
      items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    })
  }

  const removeItem = (index) => {
    setAttributes({ items: items.filter((_, i) => i !== index) })
  }

  const addItem = () => {
    setAttributes({ items: [...(items ?? []), { question: '', answer: '' }] })
  }

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={ __('FAQ', 'ra-theme') } initialOpen>
          <TextControl
            label={ __('Kicker', 'ra-theme') }
            value={ kicker }
            onChange={ (kicker) => setAttributes({ kicker }) }
          />
          <TextControl
            label={ __('Heading', 'ra-theme') }
            value={ heading }
            onChange={ (heading) => setAttributes({ heading }) }
          />
          <hr />
          { (items ?? []).map((item, index) => (
            <div key={ index } style={ { marginBottom: '0.75rem' } }>
              <TextControl
                label={ `${ __('Question', 'ra-theme') } ${ index + 1 }` }
                value={ item?.question ?? '' }
                onChange={ (question) => updateItem(index, { question }) }
              />
              <TextareaControl
                label={ __('Answer', 'ra-theme') }
                value={ item?.answer ?? '' }
                onChange={ (answer) => updateItem(index, { answer }) }
              />
              <Button isDestructive variant="link" onClick={ () => removeItem(index) }>
                { __('Remove', 'ra-theme') }
              </Button>
            </div>
          )) }
          <Button variant="primary" onClick={ addItem }>
            { __('Add question', 'ra-theme') }
          </Button>
        </PanelBody>
      </InspectorControls>

      <header>
        <p className="c-kicker">{ kicker }</p>
        <RichText tagName="h2" value={ heading } onChange={ (heading) => setAttributes({ heading }) } />
      </header>

      <div className="m-faq__list m-ra-placeholder">
        { (items ?? []).length === 0
          ? __('No questions yet — add them from block settings.', 'ra-theme')
          : (items ?? []).map((item, index) => (
            <p key={ index } style={ { margin: '0.25rem 0' } }>{ item?.question }</p>
          )) }
      </div>
    </section>
  )
}

export default Edit
