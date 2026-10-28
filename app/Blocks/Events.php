<?php

declare(strict_types=1);

namespace App\Blocks;

use App\PostTypes\Meta;

/**
 * ra/events — upcoming events ordered by their datetime meta.
 */
final class Events extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $showPast = (bool) ($attributes['showPastEvents'] ?? false);

        $query = new \WP_Query([
            'post_type' => 'event',
            'post_status' => 'publish',
            'posts_per_page' => max(1, (int) ($attributes['count'] ?? 4)),
            'no_found_rows' => true,
            'meta_key' => 'ra_event_datetime',
            'meta_type' => 'DATETIME',
            'orderby' => 'meta_value',
            'order' => $showPast ? 'DESC' : 'ASC',
        ]);

        $events = [];
        $now = current_time('timestamp');
        $timezone = wp_timezone();

        foreach ($query->posts as $event) {
            $datetimeString = Meta::get('ra_event_datetime', $event->ID);

            if ($datetimeString && ! $showPast) {
                $when = \DateTime::createFromFormat('Y-m-d H:i', $datetimeString, $timezone);

                if ($when instanceof \DateTime) {
                    $when = $when->format('U');

                    if ($when < $now) {
                        continue;
                    }
                }
            }

            $events[] = [
                'id' => $event->ID,
                'title' => get_the_title($event),
                'url' => get_permalink($event),
                'type' => get_the_terms($event->ID, 'event_type') !== false ? array_map(static fn ($term): string => $term->name, get_the_terms($event->ID, 'event_type') ?: []) : [],
                'datetime' => $datetimeString,
                'venue' => Meta::get('ra_event_venue', $event->ID),
                'ticketUrl' => Meta::get('ra_event_ticket_url', $event->ID),
            ];
        }

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Calendar'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Play, listen, experience.', 'ra-theme')),
            'events' => $events,
            'showPast' => $showPast,
            'style' => in_array($attributes['style'] ?? 'rows', ['rows', 'cards'], true) ? $attributes['style'] : 'rows',
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.events.view';
    }
}
