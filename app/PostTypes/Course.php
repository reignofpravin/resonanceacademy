<?php

declare(strict_types=1);

namespace App\PostTypes;


final class Course
{
    /**
     * Post type slug.
     */
    public const SLUG = 'course';

    public static function register(): void
    {
        register_post_type(self::SLUG, PostTypes::baseArgs('courses', __('Courses', 'ra-theme'), __('Course', 'ra-theme')));
    }
}
