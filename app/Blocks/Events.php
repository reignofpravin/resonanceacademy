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

        $queryArgs = [
            'post_type' => 'event',
            'post_status' => 'publish',
            'posts_per_page' => max(1, (int) ($attributes['count'] ?? 4)),
            'no_found_rows' => true,
            'meta_key' => 'ra_event_datetime',
            'meta_type' => 'DATETIME',
            'orderby' => 'meta_value',
            'order' => $showPast ? 'DESC' : 'ASC',
        ];

        // Filter past/future in SQL so the post cap applies to surviving rows.
        if (! $showPast) {
            $queryArgs['meta_query'] = [
                [
                    'key' => 'ra_event_datetime',
                    'value' => current_time('Y-m-d H:00'),
                    'compare' => '>=',
                    'type' => 'DATETIME',
                ],
            ];
        }

        $query = new \WP_Query($queryArgs);

        $events = [];
        $timezone = wp_timezone();

        foreach ($query->posts as $event) {
            $datetimeString = Meta::get('ra_event_datetime', $event->ID);
            $when = $datetimeString
                ? \DateTime::createFromFormat('Y-m-d H:i', $datetimeString, $timezone)
                : null;

            // Future-only: compare true epochs (format('U') is timezoned UTC;
            // current_time('timestamp') would double-apply the UTC offset).
            if ($when instanceof \DateTime && ! $showPast && $when->format('U') < time()) {
                continue;
            }

            $terms = get_the_terms($event->ID, 'event_type');

            $events[] = [
                'id' => $event->ID,
                'title' => wp_specialchars_decode(get_the_title($event), ENT_QUOTES),
                'url' => get_permalink($event),
                'type' => is_array($terms) ? array_map(static fn ($term): string => $term->name, $terms) : [],
                'when' => $when,
                'timestamp' => $when instanceof \DateTime ? $when->format('U') : 0,
                'iso' => $when instanceof \DateTime ? $when->format(DATE_W3C) : '',
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
