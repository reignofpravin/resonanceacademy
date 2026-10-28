<?php

declare(strict_types=1);

namespace App\PostTypes;

/**
 * Registers the academy's taxonomies: course_category, instrument, event_type.
 */
final class Taxonomies
{
    private const INSTRUMENT_SLUG = 'instrument';
    private const COURSE_CATEGORY_SLUG = 'course_category';
    private const EVENT_TYPE_SLUG = 'event_type';

    /**
     * Register all taxonomies on init.
     */
    public static function register(): void
    {
        register_taxonomy(self::COURSE_CATEGORY_SLUG, 'course', self::args(
            __('Course Categories', 'ra-theme'),
            __('Course Category', 'ra-theme'),
        ));

        register_taxonomy(self::INSTRUMENT_SLUG, ['course', 'instructor'], self::args(
            __('Instruments', 'ra-theme'),
            __('Instrument', 'ra-theme'),
        ));

        register_taxonomy(self::EVENT_TYPE_SLUG, 'event', self::args(
            __('Event Types', 'ra-theme'),
            __('Event Type', 'ra-theme'),
        ));
    }

    /**
     * Shared show-in-rest hierarchical taxonomy args.
     *
     * @return array<string, mixed>
     */
    private static function args(string $pluralLabel, string $singularLabel): array
    {
        return [
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_admin_column' => true,
            'public' => true,
            'rewrite' => [
                'slug' => sanitize_title($pluralLabel),
                'with_front' => false,
            ],
            'labels' => Taxonomies::labelSet($pluralLabel, $singularLabel),
        ];
    }

    /**
     * Produce the standard WP taxonomy label set.
     *
     * @return array<string, string>
     */
    private static function labelSet(string $plural, string $singular): array
    {
        return [
            'name' => $plural,
            'singular_name' => $singular,
            'menu_name' => $plural,
            'all_items' => sprintf(__('All %s', 'ra-theme'), $plural),
            'edit_item' => sprintf(__('Edit %s', 'ra-theme'), $singular),
            'view_item' => sprintf(__('View %s', 'ra-theme'), $singular),
            'update_item' => sprintf(__('Update %s', 'ra-theme'), $singular),
            'add_new_item' => sprintf(__('Add New %s', 'ra-theme'), $singular),
            'new_item_name' => sprintf(__('New %s Name', 'ra-theme'), $singular),
            'search_items' => sprintf(__('Search %s', 'ra-theme'), $plural),
            'not_found' => sprintf(__('No %s found', 'ra-theme'), strtolower($plural)),
        ];
    }
}
