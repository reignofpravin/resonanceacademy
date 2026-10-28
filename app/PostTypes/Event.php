<?php

declare(strict_types=1);

namespace App\PostTypes;

final class Event
{
    /**
     * Post type slug.
     */
    public const SLUG = 'event';

    public static function register(): void
    {
        register_post_type(self::SLUG, PostTypes::baseArgs('events', __('Events', 'ra-theme'), __('Event', 'ra-theme')));
    }
}
