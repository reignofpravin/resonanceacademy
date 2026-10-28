/**
 * ra/instructors editor.
 */
import { __ } from '@wordpress/i18n'
import { RichText, Placeholder, Spinner, useBlockProps } from '@wordpress/block-editor'
import { PanelBody, InspectorControls, RangeControl } from '@wordpress/components'
import apiFetch from '@wordpress/api-fetch'
import { useEffect, useState } from '@wordpress/element'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, count } = attributes
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const blockProps = useBlockProps({ className: 'm-instructors' })

  useEffect(() => {
    apiFetch({ path: '/wp/v2/instructor?per_page=100' })
      .then((posts) => {
        setInstructors(posts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Instructors settings', 'ra-theme')}>
          <RangeControl
            label={__('Instructors to show', 'ra-theme')}
            min={2}
            max={16}
            value={count}
            onChange={(count) => setAttributes({ count })}
          />
        </PanelBody>
      </InspectorControls>

      <header>
        <p className="c-kicker">{kicker}</p>
        <RichText
          tagName="h2"
          value={heading}
          onChange={(heading) => setAttributes({ heading })}
        />
      </header>

      <Placeholder
        icon="groups"
        label={__('Instructors scroller', 'ra-theme')}
        instructions={__('Front end renders real instructor cards server-side (scroll-snap).')}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {loading && <Spinner />}
          {instructors.slice(0, count || 8).map((p) => (
            <span key={p.id} className="m-ra-placeholder" style={{ padding: '0.4rem 0.75rem', border: '1px solid rgba(23,19,16,.2)', borderRadius: '999px' }}>
              {p.title?.rendered}
            </span>
          ))}
        </div>
      </Placeholder>
    </section>
  )
}

export default Edit
