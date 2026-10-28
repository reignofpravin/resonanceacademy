/**
 * ra/hero editor.
 */
import { __ } from '@wordpress/i18n'
import {
  InspectorControls,
  MediaPlaceholder,
  RichText,
  useBlockProps,
} from '@wordpress/block-editor'
import {
  PanelBody,
  TextControl,
  TextareaControl,
  RadioControl,
} from '@wordpress/components'

/**
 * Server component.
 *
 * @param {object} props Recursive props.
 * @returns {JSX.Element} Editor preview.
 */
const Edit = ({ attributes, setAttributes }) => {
  const {
    kicker,
    heading,
    text,
    ctaLabel,
    ctaUrl,
    secondaryLabel,
    secondaryUrl,
    canvasStyle,
  } = attributes

  const blockProps = useBlockProps({
    className: 'm-hero',
    'data-ra-hero-canvas': canvasStyle,
  })

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Hero copy', 'ra-theme')} initialOpen>
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
          <TextareaControl
            label={__('Intro text', 'ra-theme')}
            value={text}
            onChange={(text) => setAttributes({ text })}
          />
        </PanelBody>
        <PanelBody title={__('Calls to action', 'ra-theme')}>
          <TextControl
            label={__('Primary label', 'ra-theme')}
            value={ctaLabel}
            onChange={(ctaLabel) => setAttributes({ ctaLabel })}
          />
          <TextControl
            label={__('Primary URL', 'ra-theme')}
            value={ctaUrl}
            onChange={(ctaUrl) => setAttributes({ ctaUrl })}
          />
          <TextControl
            label={__('Secondary label', 'ra-theme')}
            value={secondaryLabel}
            onChange={(secondaryLabel) => setAttributes({ secondaryLabel })}
          />
          <TextControl
            label={__('Secondary URL', 'ra-theme')}
            value={secondaryUrl}
            onChange={(secondaryUrl) => setAttributes({ secondaryUrl })}
          />
        </PanelBody>
        <PanelBody title={__('Canvas motion', 'ra-theme')}>
          <RadioControl
            label={__('Waveform style', 'ra-theme')}
            options={[
              { label: __('Wave', 'ra-theme'), value: 'wave' },
              { label: __('Equalizer bars', 'ra-theme'), value: 'bars' },
            ]}
            selected={canvasStyle}
            onChange={(canvasStyle) => setAttributes({ canvasStyle })}
          />
        </PanelBody>
      </InspectorControls>

      <div className="m-hero__inner">
        <div className="m-hero__copy">
          <p className="c-kicker m-ra-placeholder">{kicker}</p>
          <RichText
            tagName="h1"
            className="m-hero__heading"
            value={heading}
            onChange={(heading) => setAttributes({ heading })}
            placeholder={__('Find your frequency.', 'ra-theme')}
          />
          <RichText
            tagName="p"
            className="m-hero__lead"
            value={text}
            onChange={(text) => setAttributes({ text })}
            placeholder={__('One-line intro to the academy…', 'ra-theme')}
          />
          <div className="m-hero__actions">
            <span className="u-ra-btn--ghost-preview">{ctaLabel}</span>
          </div>
        </div>
        <div className="m-hero__canvas m-hero__canvas--static" aria-hidden="true">
          <MediaPlaceholder
            icon="format-audio"
            labels={{ title: '' }}
          />
        </div>
      </div>
    </section>
  )
}

/**
 * Editor export.
 */
export default Edit
