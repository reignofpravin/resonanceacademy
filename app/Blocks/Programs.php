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
            $trackTerms = get_the_terms($course->ID, 'instrument');
            $track = ($trackTerms !== false && ! is_wp_error($trackTerms) && $trackTerms !== [])
                ? $trackTerms[0]->slug
                : '';

            // Plain text, not term links: the row itself is an <a>, and nested
            // anchors are invalid HTML (the parser hoists them out of the row).
            $instrumentNames = ($trackTerms !== false && ! is_wp_error($trackTerms) && $trackTerms !== [])
                ? implode(' · ', wp_list_pluck($trackTerms, 'name'))
                : '';

            $courses[] = [
                'id' => $course->ID,
                'title' => wp_specialchars_decode(get_the_title($course), ENT_QUOTES),
                'url' => get_permalink($course),
                'level' => Meta::get('ra_course_level', $course->ID),
                'duration' => Meta::get('ra_course_duration', $course->ID),
                'format' => Meta::get('ra_course_format', $course->ID),
                'track' => $track,
                'trackName' => ($trackTerms !== false && ! is_wp_error($trackTerms) && $trackTerms !== [])
                    ? $trackTerms[0]->name
                    : '',
                'instruments' => $instrumentNames,
                'thumbnail' => get_the_post_thumbnail($course, 'medium_large') ?: '',
                'art' => self::artPalette($course->ID),
            ];
        }

        // Deck's instrument index: each instrument once, at its first card —
        // the mono list that flies the carousel to that shelf.
        $deckIndex = [];

        foreach ($courses as $position => $course) {
            $slug = $course['track'];

            if ($slug !== '' && ! isset($deckIndex[$slug])) {
                $deckIndex[$slug] = [
                    'slug' => $slug,
                    'name' => $course['trackName'],
                    'position' => $position,
                ];
            }
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
            'deckIndex' => $deckIndex,
            'total' => count($courses),
            'categories' => is_wp_error($categories) ? [] : $categories,
            'archiveUrl' => $archiveUrl,
            'layout' => in_array($attributes['layout'] ?? '3col', ['3col', '2col'], true) ? $attributes['layout'] : '3col',
        ];
    }

    /**
     * Curated ink-art triads for the deck cards: three hues per course,
     * stable across loads because they are keyed to the post ID.
     *
     * @return array{a: int, b: int, c: int, angle: int}
     */
    private static function artPalette(int $id): array
    {
        $palettes = [
            [222, 258, 198],
            [204, 236, 268],
            [188, 214, 242],
            [264, 228, 190],
            [210, 168, 246],
            [38, 206, 222],
            [232, 198, 168],
        ];

        $hash = crc32('resonance-course-' . $id);
        $palette = $palettes[$hash % count($palettes)];

        return [
            'a' => $palette[0],
            'b' => $palette[1],
            'c' => $palette[2],
            'angle' => 100 + ($hash >> 4) % 140,
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
