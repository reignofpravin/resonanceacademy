/**
 * ra/contact editor.
 *
 * Selects from `window.raContactForms` (localized by the theme when CF7 is
 * active); falls back to an install hint when the global is absent.
 */
import { __ } from '@wordpress/i18n'
import { Placeholder, RichText, SelectControl, TextareaControl, TextControl, useBlockProps } from '@wordpress/block-editor'
import { InspectorControls, PanelBody } from '@wordpress/components'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, text, formId } = attributes
  const blockProps = useBlockProps({ className: 'm-contact' })
  const forms = window.raContactForms ?? null

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={ __('Contact', 'ra-theme') } initialOpen>
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
          <TextareaControl
            label={ __('Intro text', 'ra-theme') }
            value={ text }
            onChange={ (text) => setAttributes({ text }) }
          />
          { forms && (
            <SelectControl
              label={ __('Contact Form 7 form', 'ra-theme') }
              options={ [
                { label: __('Default form', 'ra-theme'), value: '0' },
                ...forms.map((form) => ({ label: form.title, value: String(form.id) })),
              ] }
              value={ String(formId || 0) }
              onChange={ (value) => setAttributes({ formId: parseInt(value, 10) }) }
            />
          ) }
        </PanelBody>
      </InspectorControls>

      <p className="c-kicker">{ kicker }</p>
      <RichText tagName="h2" value={ heading } onChange={ (heading) => setAttributes({ heading }) } />

      { forms === null
        ? (
          <Placeholder icon="email" label={ __('Contact form', 'ra-theme') }
            instructions={ __('Install and activate the Contact Form 7 plugin to render the enquiry form here.', 'ra-theme') }
          />
        )
        : (
          <Placeholder icon="email" label={ (forms.find((form) => form.id === formId)?.title) || __('Default CF7 form', 'ra-theme') }
            instructions={ __('The embedded form renders server-side on the front end.', 'ra-theme') }
          />
        ) }
    </section>
  )
}

export default Edit
