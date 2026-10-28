<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * Registers every ra/* block on init.
 */
final class Registrar
{
    /**
     * Block class-map: kebab name → server-side block class.
     *
     * @return array<string, class-string<Block>>
     */
    private static function map(): array
    {
        return [
            'hero' => Hero::class,
            'programs' => Programs::class,
            'instructors' => Instructors::class,
            'events' => Events::class,
            'method' => Method::class,
            'stats' => Stats::class,
            'testimonials' => Testimonials::class,
            'faq' => Faq::class,
            'contact' => Contact::class,
            'marquee' => Marquee::class,
        ];
    }

    /**
     * Hook all mapped blocks into init.
     */
    public static function init(): void
    {
        add_action('init', static function () {
            foreach (self::map() as $class) {
                if (! class_exists($class)) {
                    continue;
                }

                /** @var Block $block */
                $block = new $class();
                $block->register();
            }
        }, 20);
    }
}

// Registrar::init(); wired from app/Providers/ThemeServiceProvider boot.
