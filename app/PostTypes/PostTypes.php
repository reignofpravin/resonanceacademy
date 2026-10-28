<?php

declare(strict_types=1);

namespace App\PostTypes;

/**
 * Registers the course, instructor and event post types.
 */
final class PostTypes
{
    /**
     * Handlers for each registered post type.
     *
     * @return array<string, callable(): void>
     */
    public const MAPPING = [
        'course' => [Course::class, 'register'],
        'instructor' => [Instructor::class, 'register'],
        'event' => [Event::class, 'register'],
    ];

    /**
     * Boot every post type on init.
     */
    public static function register(): void
    {
        Meta::register();
        Taxonomies::register();

        foreach (self::MAPPING as $callback) {
            $callback[0]::{$callback[1]}();
        }
    }

    /**
     * Shared standard registration arguments.
     *
     * @return array<string, mixed>
     */
    public static function baseArgs(string $slug, string $pluralLabel, string $singularLabel): array
    {
        return [
            'labels' => self::labelSet($pluralLabel, $singularLabel),
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => $slug,
            'menu_icon' => 'dashicons-open-folder',
            'menu_position' => 20,
            'rewrite' => ['slug' => $slug, 'with_front' => false],
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'],
        ];
    }

    /**
     * Produce the standard PQ label set for post types.
     *
     * @return array<string, string>
     */
    private static function labelSet(string $plural, string $singular): array
    {
        return [
            'name' => $plural,
            'singular_name' => $singular,
            'menu_name' => $plural,
            'add_new' => sprintf(__('Add %s', 'ra-theme'), $singular),
            'add_new_item' => sprintf(__('Add New %s', 'ra-theme'), $singular),
            'edit_item' => sprintf(__('Edit %s', 'ra-theme'), $singular),
            'view_item' => sprintf(__('View %s', 'ra-theme'), $singular),
            'search_items' => sprintf(__('Search %s', 'ra-theme'), $plural),
            'not_found' => sprintf(__('No %s found', 'ra-theme'), strtolower($plural)),
            'all_items' => sprintf(__('All %s', 'ra-theme'), $plural),
        ];
    }
}
