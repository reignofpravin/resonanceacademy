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
     * Extra sanitizers for keys that are not enum-guarded.
     *
     * @var array<string, callable(string): string>
     */
    private const SANITIZERS = [
        'ra_event_ticket_url' => 'esc_url_raw',
        'ra_event_venue' => 'sanitize_text_field',
        'ra_instructor_role' => 'sanitize_text_field',
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
                'sanitize_callback' => static fn (string $value): string => self::sanitize($key, $value),
                'auth_callback' => static fn (): bool => current_user_can('edit_posts'),
            ]);
        }
    }

    /**
     * Sanitize a value per its key's schema: enums match case-insensitively
     * and fall back to the canonical first choice, other registered keys use
     * their dedicated sanitizer.
     */
    private static function sanitize(string $key, string $value): string
    {
        $choices = self::ENUMS[$key] ?? null;

        if ($choices === null) {
            $sanitizer = self::SANITIZERS[$key] ?? 'sanitize_text_field';

            return $sanitizer($value);
        }

        foreach ($choices as $choice) {
            if (strcasecmp($choice, trim($value)) === 0) {
                return $choice;
            }
        }

        return $choices[0];
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
