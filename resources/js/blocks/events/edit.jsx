/**
 * ra/events editor.
 */
import { __ } from '@wordpress/i18n'
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor'
import { Placeholder, PanelBody, RangeControl, SelectControl, ToggleControl, Spinner } from '@wordpress/components'
import apiFetch from '@wordpress/api-fetch'
import { useEffect, useState } from '@wordpress/element'

const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, count, showPastEvents, style } = attributes
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const blockProps = useBlockProps({ className: 'm-events' })

  useEffect(() => {
    apiFetch({ path: '/wp/v2/event?per_page=100' })
      .then((posts) => {
        setEvents(posts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Events settings', 'ra-theme')}>
          <RangeControl
            label={__('Events to show', 'ra-theme')}
            min={1}
            max={12}
            value={count}
            onChange={(count) => setAttributes({ count })}
          />
          <SelectControl
            label={__('List style', 'ra-theme')}
            options={[
              { label: __('Rows', 'ra-theme'), value: 'rows' },
              { label: __('Cards', 'ra-theme'), value: 'cards' },
            ]}
            value={style}
            onChange={(style) => setAttributes({ style })}
          />
          <ToggleControl
            label={__('Include past events', 'ra-theme')}
            checked={showPastEvents}
            onChange={(showPastEvents) => setAttributes({ showPastEvents })}
          />
        </PanelBody>
      </InspectorControls>

      <header>
        <p className="c-kicker">{kicker}</p>
        <RichText tagName="h2" value={heading} onChange={(heading) => setAttributes({ heading })} />
      </header>

      <Placeholder icon="calendar-alt" label={__('Upcoming events list', 'ra-theme')}>
        {loading && <Spinner />}
        {events.slice(0, count || 4).map((event) => (
          <div key={event.id} className="m-ra-placeholder" style={{ width: '100%' }}>
            {event.title?.rendered}
          </div>
        ))}
      </Placeholder>
    </section>
  )
}

export default Edit
