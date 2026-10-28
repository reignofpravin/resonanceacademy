<?php

declare(strict_types=1);

namespace App\PostTypes;

final class Instructor
{
    /**
     * Post type slug.
     */
    public const SLUG = 'instructor';

    public static function register(): void
    {
        register_post_type(self::SLUG, PostTypes::baseArgs('instructors', __('Instructors', 'ra-theme'), __('Instructor', 'ra-theme')));
    }
}
