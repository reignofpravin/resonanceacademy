/**
 * ra/stats editor.
 */
import { __ } from '@wordpress/i18n'
import { InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { Button, PanelBody, SelectControl, TextControl } from '@wordpress/components'

const Edit = ({ attributes, setAttributes }) => {
  const { stats, variant } = attributes
  const blockProps = useBlockProps({ className: 'm-stats' })

  const updateStat = (index, patch) => {
    setAttributes({ stats: stats.map((s, i) => (i === index ? { ...s, ...patch } : s)) })
  }

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Stats', 'ra-theme')} initialOpen>
          {(stats || []).map((stat, index) => (
            <div key={index} style={{ marginBottom: '0.75rem' }}>
              <TextControl
                label={__('Value', 'ra-theme')}
                value={String(stat?.value ?? 0)}
                onChange={(value) => updateStat(index, { value: Number(value) })}
              />
              <TextControl
                label={__('Label', 'ra-theme')}
                value={stat?.label ?? ''}
                onChange={(label) => updateStat(index, { label })}
              />
              <TextControl
                label={__('Suffix', 'ra-theme')}
                value={stat?.suffix ?? ''}
                onChange={(suffix) => updateStat(index, { suffix })}
              />
              <Button isDestructive variant="link" onClick={() => setAttributes({ stats: stats.filter((_, i) => i !== index) })}>
                {__('Remove', 'ra-theme')}
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={() => setAttributes({ stats: [...(stats ?? []), { value: 0, label: '', suffix: '' }] })}>
            {__('Add stat', 'ra-theme')}
          </Button>
          <hr />
          <SelectControl
            label={__('Variant', 'ra-theme')}
            options={[
              { label: __('Inline strip', 'ra-theme'), value: 'inline' },
              { label: __('Bordered band', 'ra-theme'), value: 'band' },
            ]}
            value={variant}
            onChange={(variant) => setAttributes({ variant })}
          />
        </PanelBody>
      </InspectorControls>

      <p className="m-ra-placeholder">{__('Stat strip renders server-side — check the preview.', 'ra-theme')}</p>
    </section>
  )
}

export default Edit
