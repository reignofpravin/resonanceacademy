/**
 * ra/method editor.
 */
import { __ } from '@wordpress/i18n'
import { MediaUpload, MediaUploadCheck, MediaPlaceholder, InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor'
import { Button, PanelBody, TextControl, TextareaControl } from '@wordpress/components'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, imageId, steps } = attributes
  const blockProps = useBlockProps({ className: 'm-method' })

  const image = imageId ? wp.element.createElement('img', {
    src: wp.data.select('core').getMedia(imageId)?.source_url ?? '',
    alt: '',
  }) : null

  const updateStep = (index, patch) => {
    const next = steps.map((step, i) => (i === index ? { ...step, ...patch } : step))

    setAttributes({ steps: next })
  }

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Method content', 'ra-theme')}>
          <TextControl
            label={__('Kicker', 'ra-theme')}
            value={kicker}
            onChange={(kicker) => setAttributes({ kicker })}
          />
          <TextControl
            label={__('Heading', 'ra-theme')}
            value={heading}
            onChange={(heading) => setAttributes({ heading })}
          />
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ imageId: media.id })}
              allowedTypes={['image']}
              value={imageId}
              render={({ open }) => (
                <Button variant="secondary" onClick={open}>
                  {imageId ? __('Replace sticky image', 'ra-theme') : __('Select sticky image', 'ra-theme')}
                </Button>
              )}
            />
          </MediaUploadCheck>
          <hr />
          {(steps || []).map((step, index) => (
            <div key={index}>
              <TextControl
                label={`${__('Step', 'ra-theme')} ${index + 1} — ${__('title', 'ra-theme')}`}
                value={step?.title ?? ''}
                onChange={(title) => updateStep(index, { title })}
              />
              <TextareaControl
                label={__('Text', 'ra-theme')}
                value={step?.text ?? ''}
                onChange={(text) => updateStep(index, { text })}
              />
              <Button isDestructive variant="link" onClick={() => setAttributes({ steps: steps.filter((_, i) => i !== index) })}>
                {__('Remove step', 'ra-theme')}
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={() => setAttributes({ steps: [...(steps ?? []), { title: '', text: '' }] })}>
            {__('Add step', 'ra-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className="m-method__inner">
        <div className="m-method__sticky">
          <p className="c-kicker">{kicker}</p>
          <h2>{heading}</h2>
          <div className="m-ra-placeholder">
            <MediaPlaceholder
              icon="format-image"
              labels={{ title: '' }}
            />
          </div>
        </div>

        <ol className="m-method__steps">
          {(steps ?? []).length === 0 && (
            <li className="m-ra-placeholder">{__('No steps yet — add them from block settings.', 'ra-theme')}</li>
          )}
          {(steps ?? []).map((step, index) => (
            <li key={index} className="m-method__step">
              <span className="m-method__num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step?.title}</h3>
                <p>{step?.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Edit
