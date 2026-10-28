<?php

declare(strict_types=1);

namespace App\Blocks;

use App\PostTypes\Meta;

/**
 * ra/programs — course grid driven by the course post type.
 */
final class Programs extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $termFilter = (int) ($attributes['termFilter'] ?? 0);

        $queryArgs = [
            'post_type' => 'course',
            'post_status' => 'publish',
            'posts_per_page' => max(1, (int) ($attributes['count'] ?? 6)),
            'no_found_rows' => true,
        ];

        if ($termFilter > 0) {
            $queryArgs['tax_query'] = [
                [
                    'taxonomy' => 'course_category',
                    'terms' => $termFilter,
                    'operator' => 'IN',
                ],
            ];
        }

        $query = new \WP_Query($queryArgs);

        $courses = [];

        foreach ($query->posts as $course) {
            $courses[] = [
                'id' => $course->ID,
                'title' => get_the_title($course),
                'url' => get_permalink($course),
                'level' => Meta::get('ra_course_level', $course->ID),
                'duration' => Meta::get('ra_course_duration', $course->ID),
                'format' => Meta::get('ra_course_format', $course->ID),
                'instruments' => get_the_term_list($course->ID, 'instrument', '<span class="m-programs__instrument">', '</span>', ''),
                'thumbnail' => get_the_post_thumbnail($course, 'medium_large') ?: '',
            ];
        }

        $categories = get_terms([
            'taxonomy' => 'course_category',
            'hide_empty' => true,
            'number' => 12,
        ]);

        $archiveUrl = get_post_type_archive_link('course') ?: home_url('/courses/');

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Programs'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Courses that move you forward.', 'ra-theme')),
            'courses' => $courses,
            'categories' => is_wp_error($categories) ? [] : $categories,
            'archiveUrl' => $archiveUrl,
            'layout' => in_array($attributes['layout'] ?? '3col', ['3col', '2col'], true) ? $attributes['layout'] : '3col',
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.programs.view';
    }
}
