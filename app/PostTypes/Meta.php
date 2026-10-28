<?php

declare(strict_types=1);

namespace App\PostTypes;

/**
 * Shared metadata registry for the academy's content types.
 */
final class Meta
{
    /**
     * Registered post-type meta: [key, postType, type, enum(list), default]
     *
     * @var array<string, array{postType: string, type: string, nullable: bool}>
     */
    private const SCHEMA = [
        'ra_course_level' => ['postType' => 'course', 'type' => 'string', 'default' => 'Beginner'],
        'ra_course_duration' => ['postType' => 'course', 'type' => 'string', 'default' => ''],
        'ra_course_format' => ['postType' => 'course', 'type' => 'string', 'default' => 'group'],
        'ra_instructor_role' => ['postType' => 'instructor', 'type' => 'string', 'default' => ''],
        'ra_event_datetime' => ['postType' => 'event', 'type' => 'string', 'default' => ''],
        'ra_event_venue' => ['postType' => 'event', 'type' => 'string', 'default' => ''],
        'ra_event_ticket_url' => ['postType' => 'event', 'type' => 'string', 'default' => ''],
    ];

    /**
     * Schema choice domains enforced at save time.
     *
     * @var array<string, list<string>>
     */
    private const ENUMS = [
        'ra_course_level' => ['Beginner', 'Intermediate', 'Advanced'],
        'ra_course_format' => ['group', 'private', 'hybrid'],
    ];

    /**
     * Register every meta key on init.
     */
    public static function register(): void
    {
        foreach (self::SCHEMA as $key => $spec) {
            register_post_meta($spec['postType'], $key, [
                'type' => $spec['type'],
                'single' => true,
                'show_in_rest' => true,
                'default' => $spec['default'],
                'sanitize_callback' => array_key_exists($key, self::ENUMS)
                    ? static fn (string $value): string => in_array($value, self::ENUMS[$key], true) ? $value : self::ENUMS[$key][0]
                    : null,
                'auth_callback' => static fn (): bool => current_user_can('edit_posts'),
            ]);
        }
    }

    /**
     * Safe lookup of a registered meta value with its schema default.
     */
    public static function get(string $key, int $postId): string
    {
        $spec = self::SCHEMA[sanitize_key($key)] ?? null;

        if ($spec === null) {
            return '';
        }

        $value = get_post_meta($postId, $key, true);

        return is_string($value) && $value !== '' ? $value : $spec['default'];
    }

    /**
     * Whether a key is allowed for the given post type.
     */
    public static function exists(string $key): bool
    {
        return array_key_exists(sanitize_key($key), self::SCHEMA);
    }
}
