/**
 * ra/testimonials editor.
 */
import { __ } from '@wordpress/i18n'
import { RichText, TextControl, TextareaControl, Button, InspectorControls, PanelBody, useBlockProps } from '@wordpress/block-editor'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, quotes, interval } = attributes
  const blockProps = useBlockProps({ className: 'm-testimonials' })

  const updateQuote = (index, patch) => {
    setAttributes({
      quotes: quotes.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    })
  }

  const removeQuote = (index) => {
    setAttributes({ quotes: quotes.filter((_, i) => i !== index) })
  }

  const addQuote = () => {
    setAttributes({ quotes: [...(quotes ?? []), { quote: '', name: '', role: '' }] })
  }

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={ __('Testimonials', 'ra-theme') } initialOpen>
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
          <TextControl
            label={ __('Seconds per quote', 'ra-theme') }
            value={ String(interval || 8) }
            onChange={ (value) => setAttributes({ interval: Math.max(3, parseInt(value, 10) || 8) }) }
          />
          <hr />
          { (quotes ?? []).map((quote, index) => (
            <div key={ index } style={ { marginBottom: '0.75rem' } }>
              <TextareaControl
                label={ `${ __('Quote', 'ra-theme') } ${ index + 1 }` }
                value={ quote?.quote ?? '' }
                onChange={ (quote) => updateQuote(index, { quote }) }
              />
              <TextControl
                label={ __('Name', 'ra-theme') }
                value={ quote?.name ?? '' }
                onChange={ (name) => updateQuote(index, { name }) }
              />
              <TextControl
                label={ __('Role / course', 'ra-theme') }
                value={ quote?.role ?? '' }
                onChange={ (role) => updateQuote(index, { role }) }
              />
              <TextControl
                label={ __('Avatar image URL (optional)', 'ra-theme') }
                value={ quote?.avatar ?? '' }
                onChange={ (avatar) => updateQuote(index, { avatar }) }
              />
              <Button isDestructive variant="link" onClick={ () => removeQuote(index) }>
                { __('Remove', 'ra-theme') }
              </Button>
            </div>
          )) }
          <Button variant="primary" onClick={ addQuote }>
            { __('Add quote', 'ra-theme') }
          </Button>
        </PanelBody>
      </InspectorControls>

      <header>
        <p className="c-kicker">{ kicker }</p>
        <RichText tagName="h2" value={ heading } onChange={ (heading) => setAttributes({ heading }) } />
      </header>

      <div className="m-testimonials__stage m-ra-placeholder" aria-hidden="true">
        <p style={ { margin: 0 } }>
          { (quotes ?? []).length === 0
            ? __('No quotes yet — add them from block settings.', 'ra-theme')
            : `${ (quotes ?? []).length } ${ __('quotes; renders as a slider on the front end.', 'ra-theme') }` }
        </p>
      </div>
    </section>
  )
}

export default Edit
