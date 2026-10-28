<?php

declare(strict_types=1);

namespace App\Blocks;

use App\PostTypes\Meta;

/**
 * ra/instructors — horizontal scroll-snap scroller of instructor cards.
 */
final class Instructors extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $query = new \WP_Query([
            'post_type' => 'instructor',
            'post_status' => 'publish',
            'posts_per_page' => max(2, (int) ($attributes['count'] ?? 8)),
            'no_found_rows' => true,
        ]);

        $instructors = [];

        foreach ($query->posts as $instructor) {
            $instructors[] = [
                'id' => $instructor->ID,
                'title' => get_the_title($instructor),
                'url' => get_permalink($instructor),
                'role' => Meta::get('ra_instructor_role', $instructor->ID),
                'excerpt' => wp_strip_all_tags(get_the_excerpt($instructor)),
                'instruments' => array_map(
                    static fn ($term): string => $term->name,
                    get_the_terms($instructor->ID, 'instrument') ?: [],
                ),
                'thumbnail' => get_the_post_thumbnail($instructor, 'medium') ?: '',
            ];
        }

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Faculty'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Learn from the players.', 'ra-theme')),
            'instructors' => $instructors,
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.instructors.view';
    }
}
