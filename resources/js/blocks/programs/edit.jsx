/**
 * ra/programs editor.
 */
import { __ } from '@wordpress/i18n'
import {
  InspectorControls,
  RichText,
  useBlockProps,
} from '@wordpress/block-editor'
import { PanelBody, SelectControl, RangeControl, Spinner, Placeholder } from '@wordpress/components'
import apiFetch from '@wordpress/api-fetch'
import { useEffect, useState } from '@wordpress/element'

/**
 * Server component.
 *
 * @param {object} props Recursive props.
 * @returns {JSX.Element} Editor preview.
 */
const Edit = ({ attributes, setAttributes }) => {
  const { kicker, heading, termFilter, count, layout } = attributes
  const [courseCategories, setCourseCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const blockProps = useBlockProps({ className: 'm-programs' })

  // eslint-disable-next-line jsdoc/require-jsdoc
  useEffect(() => {
    Promise.all([
      apiFetch({ path: '/wp/v2/course_category?per_page=100' }),
      apiFetch({ path: '/wp/v2/course?per_page=100&_embed=wp:featuredmedia' }),
    ]).then(([terms, posts]) => {
      setCourseCategories(terms)
      setCourses(posts)
      setLoading(false)
    }).catch(() => setLoading(false))
    // eslint-disable-next-line jsdoc/require-jsdoc
  }, [])

  // eslint-disable-next-line jsdoc/require-jsdoc
  const filtered = termFilter
    ? courses.filter((course) => course.course_category?.includes(termFilter))
    : courses
  const visible = filtered.slice(0, count || 6)

  // eslint-disable-next-line jsdoc/require-jsdoc
  return (
    <section { ...blockProps }>
      <InspectorControls>
        <PanelBody title={__('Programs settings', 'ra-theme')}>
          <SelectControl
            label={__('Filter by course category', 'ra-theme')}
            options={[
              { label: __('All categories', 'ra-theme'), value: '0' },
              ...courseCategories.map((term) => ({
                label: term.name,
                value: term.id,
              })),
            ]}
            value={String(termFilter || 0)}
            onChange={(value) => setAttributes({ termFilter: parseInt(value, 10) })}
          />
          <RangeControl
            label={__('Courses to show', 'ra-theme')}
            min={1}
            max={12}
            value={count}
            onChange={(count) => setAttributes({ count })}
          />
          <SelectControl
            label={__('Grid layout', 'ra-theme')}
            options={[
              { label: __('3 columns', 'ra-theme'), value: '3col' },
              { label: __('2 columns', 'ra-theme'), value: '2col' },
            ]}
            value={layout}
            onChange={(layout) => setAttributes({ layout })}
          />
        </PanelBody>
      </InspectorControls>

      <header className="m-programs__header">
        <p className="c-kicker">{kicker}</p>
        <RichText
          tagName="h2"
          className="m-programs__heading"
          value={heading}
          onChange={(heading) => setAttributes({ heading })}
        />
      </header>

      <Placeholder
        icon="grid-view"
        label={__('Programs grid', 'ra-theme')}
        instructions={__('The front end renders real course cards server-side. This preview shows the first courses so you can judge layout.', 'ra-theme')}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {loading && <Spinner />}
          {visible.map((course) => (
            <div
              key={course.id}
              className="m-ra-placeholder"
              style={{
                flex: '0 0 40%',
                border: '1px solid rgba(23,19,16,.15)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
              }}
            >
              <strong>{course.title?.rendered}</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {(course.course_category || []).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Placeholder>
    </section>
  )
}

export default Edit
